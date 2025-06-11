import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../core/utils/connections';

export interface UsersV2Interface extends Model {
    id: number;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'user';
    is_active: boolean;
    email_verified: boolean;
    verification_token: string | null;
    reset_password_token: string | null;
    reset_password_expires: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export const UsersV2 = sequelize.define<UsersV2Interface>(
    'UsersV2',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verification_token: DataTypes.STRING,
        reset_password_token: DataTypes.STRING,
        reset_password_expires: DataTypes.DATE,
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: DataTypes.DATE,
    },
    {
        tableName: 'users_v2',
        underscored: true,
        paranoid: true,
    },
);
