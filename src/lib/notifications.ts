import { prisma } from '@/lib/database';

export interface NotificationData {
    userId: string;
    notificationType: 'INTRO_REQUEST' | 'INTRO_ACCEPTED' | 'INTRO_DECLINED' | 'MESSAGE' | 'PROFILE_VIEWED' | 'VERIFICATION_COMPLETE' | 'SUBSCRIPTION_EXPIRING' | 'SYSTEM_ALERT';
    title: string;
    message: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    actionUrl?: string;
    channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'SMS';
}

/**
 * Create a notification for a user
 */
export async function createNotification(data: NotificationData): Promise<void> {
    try {
        await prisma.notification.create({
            data: {
                userId: data.userId,
                notificationType: data.notificationType,
                title: data.title,
                message: data.message,
                relatedEntityType: data.relatedEntityType,
                relatedEntityId: data.relatedEntityId,
                actionUrl: data.actionUrl,
                channel: data.channel,
                status: 'PENDING',
            },
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
        // Don't throw - notifications are not critical
    }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId: string, limit: number = 20, offset: number = 0) {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const totalCount = await prisma.notification.count({
            where: { userId },
        });

        return {
            notifications,
            totalCount,
            hasMore: offset + limit < totalCount,
        };
    } catch (error) {
        console.error('Failed to get user notifications:', error);
        return {
            notifications: [],
            totalCount: 0,
            hasMore: false,
        };
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
        const result = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return result.count > 0;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
    try {
        const result = await prisma.notification.updateMany({
            where: { userId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return result.count;
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        return 0;
    }
}
