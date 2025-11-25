import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './model/transactions.model';
import { Op } from 'sequelize';
import { SortBy, SortOrder } from 'src/common/dto/sort.dto';
import { TransactionsQueryDto } from './dto/transactions.dto';
import { User } from 'src/users/models/users.model';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction) private transactionsModel: typeof Transaction
    ) { }

    createQuery(dto: any) {
        const {
            userId,
            bookingId,
            paymentId,
            type,
            direction,
            amount,
            currency,
            status,
            transactionReference,
            isRefunded,
            refundReference,
            txnId,
            query, page = 1, limit = 10, } = dto;
        const offset = (page - 1) * limit;

        const where = {};
        if (userId) where['userId'] = userId;
        if (bookingId) where['bookingId'] = bookingId;
        if (paymentId) where['paymentId'] = paymentId;
        if (type) where['type'] = type;
        if (direction) where['direction'] = direction;
        if (amount) where['amount'] = amount;
        if (currency) where['currency'] = currency;
        if (status) where['status'] = status;
        if (transactionReference) where['transactionReference'] = transactionReference;
        if (isRefunded) where['isRefunded'] = isRefunded;
        if (refundReference) where['refundReference'] = refundReference;
        if (txnId) where['txnId'] = txnId;

        if (query) {
            where['query'] = {
                [Op.or]: [
                    { flightNumber: { [Op.like]: `%${query}%` } },
                    { from: { [Op.like]: `%${query}%` } },
                    { to: { [Op.like]: `%${query}%` } }
                ]
            }
        }

        return {
            where,
            offset
        }
    }

    async getAllTransactions(query: TransactionsQueryDto, userId: string) {
        const {
            page = 1,
            limit = 10,
            sortBy = SortBy.CREATED_AT,
            sortOrder = SortOrder.DESC
        } = query
        try {
            const { where, offset } = this.createQuery(query)
            const { rows: transactions, count: total } = await this.transactionsModel.findAndCountAll({
                where: {
                    ...where,
                    userId
                },
                include: [
                    // { all: true },
                    {
                        model: User,
                        attributes: ['email', 'firstName', 'lastName', 'phone', 'isActive']
                    }
                ],
                offset,
                limit,
                order: [[sortBy, sortOrder]],
            })

            return {
                transactions,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit,
            }
        } catch (error) {
            throw new HttpException(
                error.message || "Something went wrong!",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
