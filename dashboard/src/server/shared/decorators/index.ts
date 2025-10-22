
import { Injectable } from 'najm-api';
import { db } from '../../database/db';

/**
 * Repository decorator for database-backed services
 * Automatically injects the database instance and applies Injectable
 */
export function Repository() {
    return function (target) {
        Injectable()(target);

        Object.defineProperty(target.prototype, 'db', {
            get: function () {
                return db;
            },
            configurable: true
        });

        return target as any;
    };
}

/**
 * DB property decorator for injecting the database instance
 * Usage: @DB() private database: DB;
 */
export function DB() {
    return function (target: any, propertyKey: string) {
        const descriptor = {
            get: function () {
                return db;
            },
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(target, propertyKey, descriptor);
    };
}
