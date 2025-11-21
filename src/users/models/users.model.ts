import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsEmail,
} from 'sequelize-typescript';
import { EnumRoles } from '../enums/roles.enum';
import { HasMany } from 'sequelize-typescript';
import { Hotel } from '../../hotels/models/hotels.model';
import { Airlines } from 'src/airlines/models/airlines.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true, // soft deletes
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  // Multiple roles: ['user', 'admin', 'manager', 'superadmin']
  @Default([EnumRoles.USER])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  roles: EnumRoles[];

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string | null;

  // 2FA enabled or not
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  twoFactorEnabled: boolean;

  // Secret used to generate TOTP codes (Google Authenticator, Authy, etc.)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  twoFactorSecret: string | null;

  @HasMany(() => Hotel)
  hotels: Hotel[];

  @HasMany(() => Airlines)
  airlines: Airlines[];
}
