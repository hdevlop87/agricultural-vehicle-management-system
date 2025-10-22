import { getInstance, Guards, Headers, Ctx } from "najm-api";
import { TokenService, UserService } from "@/server/modules";

const ROLE_HIERARCHY = {
    'user': 0,
    'operator': 1,
    'mechanic': 2,
    'supervisor': 3,
    'manager': 4,
    'admin': 5,
};

async function hasRole(authorization, requiredRole, context) {
    const tokenService = getInstance(TokenService);
    const userService = getInstance(UserService);

    const userId = await tokenService.getUserIdByAccessToken(authorization);
    const user = await userService.getById(userId);

    if (!user) return false;

    if (context) {
        context.set('user', user);
    }

    const userLevel = ROLE_HIERARCHY[user.role.toLowerCase()] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole.toLowerCase()] || 0;
    return userLevel >= requiredLevel;
}

async function isAuthenticated(authorization, context) {
    if (!authorization) return false;

    const tokenService = getInstance(TokenService);
    const userService = getInstance(UserService);

    try {
        const userId = await tokenService.getUserIdByAccessToken(authorization);
        if (!userId) return false;
        
        const user = await userService.getById(userId);
        if (!user) return false;
        
        if (context) {
            context.set('user', user);
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

export class RoleGuards {

    static async isAuth(@Headers('authorization') authorization, @Ctx() context) {
        return await isAuthenticated(authorization, context);
    }

    static async isAdmin(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'admin', context);
    }

    static async isManager(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'manager', context);
    }

    static async isSupervisor(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'supervisor', context);
    }

    static async isMechanic(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'mechanic', context);
    }

    static async isOperator(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'operator', context);
    }

    static async isUser(@Headers('authorization') authorization, @Ctx() context) {
        return await hasRole(authorization, 'user', context);
    }
}

// Export all guards
export const isAuth = () => Guards(RoleGuards.isAuth);
export const isAdmin = () => Guards(RoleGuards.isAdmin);
export const isManager = () => Guards(RoleGuards.isManager);
export const isSupervisor = () => Guards(RoleGuards.isSupervisor);
export const isMechanic = () => Guards(RoleGuards.isMechanic);
export const isOperator = () => Guards(RoleGuards.isOperator);
export const isUser = () => Guards(RoleGuards.isUser);

// For backward compatibility - alias for isAuth
export const isLoggedIn = () => Guards(RoleGuards.isAuth);