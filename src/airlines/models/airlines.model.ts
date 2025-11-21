import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Flights } from 'src/flights/models/flights.model';
import { User } from 'src/users/models/users.model';

@Table({ tableName: 'airlines', paranoid: true, timestamps: true })
export class Airlines extends Model<Airlines> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string; // Ex: EK, QR

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logo: string; // optional (S3 URL)

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified: boolean;

  @HasMany(() => Flights)
  flights: Flights[];
}
