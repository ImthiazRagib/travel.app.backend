export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
}

export enum BedType {
  KING = 'king',
  QUEEN = 'queen',
  TWIN = 'twin',
  DOUBLE = 'double',
}

export interface RoomAmenity {
  wifi?: boolean;
  tv?: boolean;
  ac?: boolean;
  miniBar?: boolean;
  balcony?: boolean;
  breakfastIncluded?: boolean;
  parking?: boolean;
  poolAccess?: boolean;
  [key: string]: any;
}
