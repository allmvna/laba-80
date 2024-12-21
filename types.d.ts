export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Place {
    id: number;
    name: string;
    description?: string;
}

export interface Item {
    id: number;
    categoryId: number;
    placeId: number;
    name: string;
    description?: string;
    photo?: string;
    dateAdded: string;
}