export enum EnumRoles {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',

    VENDOR = 'vendor', // owner of a vendor account, hotel, restaurant etc.
    STAFF = 'staff', // employee of a vendor account
    MARKETING = 'marketing', // marketing team member of a vendor account
    BROKER = 'broker', // third-party broker or agent
    USER = 'user', // regular customer, owner of hotel, manager, staff etc.
    MANAGER = 'manager',
    // RECEPTIONIST = 'receptionist',
    // HOUSEKEEPING = 'housekeeping',
    // GUEST = 'guest',
    // MAINTENANCE = 'maintenance',
    // CHEF = 'chef',
    // BELLBOY = 'bellboy',
    // CONCIERGE = 'concierge'
}