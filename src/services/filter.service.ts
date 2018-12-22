import { Injectable } from "@angular/core";

@Injectable()

export class FilterService {

    constructor() { }

    getFilters() {
        return this.filters.slice();
    }

    filters = [
        {
            name: 'Animal Type',
            id: 'animal',
            active: false,
            currentItem: 'Any',
            items: [
                { name: 'Any', id: '' },
                { name: 'Dog', id: 'dog' },
                { name: 'Cat', id: 'cat' },
                { name: 'Small & Furry', id: 'smallfurry' },
                { name: 'Bird', id: 'bird' },
                { name: 'Reptile', id: 'reptile' },
                { name: 'Horse', id: 'horse' },
                { name: 'Barnyard', id: 'barnyard' }],
        },
        {
            name: 'Breed',
            id: 'breed',
            active: false,
            currentItem: 'Any',
            items: [],            
        },
        {
            name: 'Gender',
            id: 'sex',
            active: false,
            currentItem: 'Any',
            items: [
                { name: 'Any', id: '' },
                { name: 'Male', id: 'M' },
                { name: 'Female', id: 'F' }
            ],
        },
        {
            name: 'Size',
            id: 'size',
            active: false,
            currentItem: 'Any',
            items: [
                { name: 'Any', id: '' },
                { name: 'Small', id: 'S' },
                { name: 'Medium', id: 'M' },
                { name: 'Large', id: 'L' },
                { name: 'Extra Large', id: 'XL' }
            ],          
        },
        {
            name: 'Age',
            id: 'age',
            active: false,
            currentItem: 'Any',
            items: [
                { name: 'Any', id: '' },
                { name: 'Baby', id: 'Baby' },
                { name: 'Young', id: 'Young' },
                { name: 'Adult', id: 'Adult' },
                { name: 'Senior', id: 'Senior' }
            ],          
        }
    ]
}

