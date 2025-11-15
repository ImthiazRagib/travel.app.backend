import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsEmail,
} from 'sequelize-typescript';

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

  // Multiple roles: ['user', 'admin', 'manager']
  @Default(['user'])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  roles: string[];

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
}
