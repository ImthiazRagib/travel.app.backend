import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Booking } from './models/bookings.model';
import { Payment } from 'src/payments/models/payments.model';
import { Transaction } from 'src/transactions/model/transactions.model';
import { Room } from 'src/rooms/models/rooms.model';
import { Sequelize } from 'sequelize-typescript';
import { BookRoomDto } from './dto/book-room.dto';
import { BookingCategory, BookingStatus } from './enums/bookings.enum';
import { PaymentStatus, ProviderEnum } from 'src/payments/enums/payment.enum';
import { CurrencyTypes, TransactionDirection, TransactionStatus, TransactionsType } from 'src/transactions/enums/transactions.enum';
import { Hotel } from 'src/hotels/models/hotels.model';
import { Flights } from 'src/flights/models/flights.model';
import { BookFlightDto } from './dto/book-flight.dto';
import { User } from 'src/users/models/users.model';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking) private bookingModel: typeof Booking,
        @InjectModel(Room) private roomModel: typeof Room,
        @InjectModel(Hotel) private hotelModel: typeof Hotel,
        @InjectModel(Flights) private flightModel: typeof Flights,
        @InjectModel(Payment) private paymentModel: typeof Payment,
        @InjectModel(Transaction) private transactionModel: typeof Transaction,
        @InjectConnection() private readonly sequelize: Sequelize
    ) { }

    async bookRoom(dto: BookRoomDto, userId: string) {
        // return dto
        try {
            return this.sequelize.transaction(async (t) => {
                // * Find room and check availability
                const room = await this.roomModel.findByPk(dto.roomId, { transaction: t });
                if (!room) throw new NotFoundException('Room not found');
                const vRoom = room.get({ plain: true });
                if (Number(vRoom.remainingRooms) < 1) throw new BadRequestException('No rooms available');

                // * Calculate total nights and amount
                const checkInDate = new Date(dto.checkIn);
                const checkOutDate = new Date(dto.checkOut);
                const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                const totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (totalNights < 1) throw new BadRequestException('Check-out must be after check-in');

                const totalAmount = dto.amount ?? totalNights * Number(room.pricePerNight);

                // * Create Booking
                const booking = await this.bookingModel.create({
                    customerId: userId,
                    hotelId: dto.hotelId,
                    roomId: dto.roomId,
                    checkIn: dto.checkIn,
                    checkOut: dto.checkOut,
                    totalNights,
                    totalAmount,
                    guests: dto.guests,
                    bookingCategory: BookingCategory.ROOM,
                    paymentMethod: dto.paymentMethod,
                } as Booking, { transaction: t });

                // * Create Payment
                const payment = await this.paymentModel.create({
                    bookingId: booking.id,
                    cardNumber: dto.cardNumber,
                    amount: totalAmount,
                    direction: TransactionDirection.Debit,
                    status: PaymentStatus.PENDING,
                    provider: dto.paymentMethod,
                } as Payment, { transaction: t });

                // * Create Transaction
                const transaction = await this.transactionModel.create({
                    userId: userId,
                    bookingId: booking.id,
                    paymentId: payment.id,
                    type: TransactionsType.Purchase,
                    direction: TransactionDirection.Credit,
                    amount: totalAmount,
                    currency: dto.currency, //! create a type
                    status: TransactionStatus.Pending,
                    txnId: `TXN-${Date.now()}`,
                    notes: 'Room booking transaction'
                } as Transaction, { transaction: t });

                // * Update Room availability
                await room.update({ remainingRooms: vRoom.remainingRooms - 1 }, { transaction: t });

                // * Update booking with transaction id
                await booking.update({ transactionId: transaction.id }, { transaction: t });

                return {
                    message: `An email with invoice has been sent to you.`
                }
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async bookFlight(dto: BookFlightDto, userId: string) {
        try {
            return this.sequelize.transaction(async (t) => {
                // check the flight availability
                const flight = await this.flightModel.findByPk(dto.flightId, { transaction: t });
                if (!flight) throw new NotFoundException('Flight not found');
                const vFlight = flight.get({ plain: true });
                if (vFlight.availableSeats < 1) throw new BadRequestException('No seats available');

                // update the flight available seats
                await flight.update({ availableSeats: vFlight.availableSeats - 1 }, { transaction: t });

                //* create the booking
                const booking = await this.bookingModel.create({
                    airlineId: dto.airlineId,
                    customerId: userId,
                    flightId: vFlight.id,
                    totalAmount: dto.totalAmount,
                    bookingCategory: BookingCategory.FLIGHT,
                    paymentMethod: dto.paymentMethod
                } as unknown as Booking, { transaction: t });

                // * Create Payment
                const payment = await this.paymentModel.create({
                    bookingId: booking.id,
                    cardNumber: dto.cardNumber,
                    amount: dto.totalAmount,
                    direction: TransactionDirection.Debit,
                    status: PaymentStatus.PENDING,
                    provider: dto.paymentMethod,
                } as Payment, { transaction: t });

                // * Create Transaction
                const transaction = await this.transactionModel.create({
                    userId: userId,
                    bookingId: booking.id,
                    paymentId: payment.id,
                    type: TransactionsType.Purchase,
                    direction: TransactionDirection.Credit,
                    amount: dto.totalAmount,
                    currency: dto.currency,
                    status: TransactionStatus.Pending,
                    txnId: `TXN-${Date.now()}`,
                    notes: dto.notes
                } as Transaction, { transaction: t });

                // * Update booking with transaction id
                await booking.update({ transactionId: transaction.id }, { transaction: t });

                return {
                    message: `An email with invoice has been sent to you.`
                }

            })
        } catch (error) {
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );

        }
    }

    async getBookingsByUserId(userId: string) {
        try {
            return this.bookingModel.findAll({
                where: {
                    customerId: userId,
                },
                include: ['transaction', 'airline', 'payments', {
                    model: User,
                    as: 'customer',
                    attributes: [
                        "firstName",
                        "lastName",
                        "email",
                        "isActive",
                        "phone",
                    ]
                }]
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll() {
        return this.bookingModel.findAll({
            include: [
                { model: Room, as: 'room' },
                { model: Hotel, as: 'hotel' },
                { model: Payment, as: 'payments' },
                { model: Transaction, as: 'transaction' },
            ],
        });
    }
}
