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
import { TransactionDirection, TransactionStatus } from 'src/transactions/enums/transactions.enum';
import { Hotel } from 'src/hotels/models/hotels.model';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking) private bookingModel: typeof Booking,
        @InjectModel(Room) private roomModel: typeof Room,
        @InjectModel(Payment) private paymentModel: typeof Payment,
        @InjectModel(Transaction) private transactionModel: typeof Transaction,
        @InjectConnection() private readonly sequelize: Sequelize
    ) { }

    async bookRoom(dto: BookRoomDto) {
        // return dto
        try {
            return this.sequelize.transaction(async (t) => {
                // 1️⃣ Find room and check availability
                const room = await this.roomModel.findByPk(dto.roomId, { transaction: t });
                if (!room) throw new NotFoundException('Room not found');
                const vRoom = room.get({ plain: true });
                if (Number(vRoom.remainingRooms) < 1) throw new BadRequestException('No rooms available');

                // 2️⃣ Calculate total nights and amount
                const checkInDate = new Date(dto.checkIn);
                const checkOutDate = new Date(dto.checkOut);
                const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                const totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (totalNights < 1) throw new BadRequestException('Check-out must be after check-in');

                const totalAmount = dto.amount ?? totalNights * Number(room.pricePerNight);

                // 3️⃣ Create Booking
                const booking = await this.bookingModel.create({
                    customerId: dto.customerId,
                    hotelId: dto.hotelId,
                    roomId: dto.roomId,
                    checkIn: dto.checkIn,
                    checkOut: dto.checkOut,
                    totalNights,
                    totalAmount,
                    guests: dto.guests,
                    bookingStatus: BookingStatus.PENDING,
                    bookingCategory: BookingCategory.ROOM,
                    paymentMethod: dto.paymentMethod,
                } as Booking, { transaction: t });

                // 4️⃣ Create Payment
                const payment = await this.paymentModel.create({
                    bookingId: booking.id,
                    cardNumber: dto.cardNumber,
                    amount: totalAmount,
                    direction: TransactionDirection.Credit,
                    status: PaymentStatus.PENDING,
                    provider: ProviderEnum[dto.paymentMethod],
                } as Payment, { transaction: t });

                // 5️⃣ Create Transaction
                const transaction = await this.transactionModel.create({
                    userId: dto.customerId,
                    bookingId: booking.id,
                    paymentId: payment.id,
                    type: 'booking', //! create a type
                    direction: TransactionDirection.Credit,
                    amount: totalAmount,
                    currency: 'USD', //! create a type
                    status: TransactionStatus.Pending,
                    txnId: `TXN-${Date.now()}`,
                    notes: 'Room booking transaction'
                } as Transaction, { transaction: t });

                // 6️⃣ Update Room availability
                await room.update({ remainingRooms: vRoom.remainingRooms - 1 }, { transaction: t });

                // 6️⃣ Update Room availability
                await room.update({ remainingRooms: vRoom.remainingRooms - 1 }, { transaction: t });

                // 7️⃣ Update booking with transaction id
                await booking.update({ transactionId: transaction.id }, { transaction: t });
                return {
                    booking,
                    payment,
                    transaction,
                };
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getBookingsByUserId(userId: string) {
        return this.bookingModel.findAll({
            where: {
                customerId: userId,
            },
        });
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
