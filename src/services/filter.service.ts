import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";

@Injectable()

export class FilterService {

    constructor() { }

    types;
    distance: FilterItem = {
        name: "Distance (mi)",
        id: "distance",
        active: false,
        currentItem: 500,
        items: [
            { name: "10", id: 10 },
            { name: "25", id: 25 },
            { name: "50", id: 50 },
            { name: "100", id: 100 },
            { name: "500", id: 500 },
        ]
    }
    gender: FilterItem = {
        name: "Gender",
        id: "gender",
        active: false,
        currentItem: "Any",
        items: [
            { name: "Male", id: "Male" },
            { name: "Female", id: "Female" }
        ]
    }
    age: FilterItem =
        {
            name: 'Age',
            id: 'age',
            active: false,
            currentItem: 'Any',
            items: [
                { name: 'Any', id: '' },
                { name: 'Baby', id: 'baby' },
                { name: 'Young', id: 'young' },
                { name: 'Adult', id: 'adult' },
                { name: 'Senior', id: 'senior' }]
        }

    size: FilterItem = {
        name: 'Size',
        id: 'size',
        active: false,
        currentItem: 'Any',
        items: [
            { name: 'Any', id: '' },
            { name: 'Small', id: 'small' },
            { name: 'Medium', id: 'medium' },
            { name: 'Large', id: 'large' },
            { name: 'Extra Large', id: 'xlarge' }
        ],
    }

    breed: FilterItem = {
        name: 'Breed',
        id: 'breed',
        active: false,
        currentItem: 'Any',
        items: [],
    }

    filterItems = [
        { name: 'Pet Type', id: 'type', property: 'name' },
        { name: 'Distance', id: 'distance', property: 'distance' },
        { name: 'Breed', id: 'breed', property: 'breeds' },
        { name: 'Gender', id: 'gender', property: 'genders' },
        { name: 'Size', id: 'size', property: 'sizes' },
        { name: 'Age', id: 'age', property: 'ages' },
        { name: 'Color', id: 'color', property: 'colors' },
        { name: 'Coat', id: 'coat', property: 'coats' },
    ]

    getFilters() {
        return [...this.filters];
    }

    setTypes(types) {
        this.types = types;
    }

    getTypes() {
        return [...this.types];
    }

    populateFilters(selectedType = null) {
        const types = this.getTypes();
        let filters = [];
        for (let x of this.filterItems) {

            if (this[x.id]) {
                filters.push(this[x.id])
            } else {
                let filterObj = new FilterItem(x);
                let selectedTypeFilter;
                if (filterObj.id === 'type') {
                    if (selectedType) { filterObj.currentItem = selectedType; }
                    filterObj.items = types.map(i => {
                        return { name: i[x.property], id: i[x.property] }
                    });
                    filters.push(filterObj);
                } else if (selectedType) {
                    selectedTypeFilter = types.find(obj => obj.name == selectedType);
                    filterObj.items = selectedTypeFilter[x.property].map(y => {
                        return { name: y, id: y }
                    })
                    filters.push(filterObj);
                }
            }
        }
        this.filters = [...filters];
        return this.getFilters();

        // this.filters.find(obj => {
        //     if (obj.id === 'type') {
        //         obj.items = types.map(x => x['name']);
        //     }
        // });
        // return this.filters;
    }

    filters = [
        // {
        //     name: 'Animal Type',
        //     id: 'type',
        //     active: false,
        //     currentItem: 'Any',
        //     items: [
        //         // { name: 'Any', id: '' },
        //         // { name: 'Dog', id: 'dog' },
        //         // { name: 'Cat', id: 'cat' },
        //         // { name: 'Small & Furry', id: 'smallfurry' },
        //         // { name: 'Bird', id: 'bird' },
        //         // { name: 'Reptile', id: 'reptile' },
        //         // { name: 'Horse', id: 'horse' },
        //         // { name: 'Barnyard', id: 'barnyard' }
        //     ],
        // },
        // {
        //     name: 'Breed',
        //     id: 'breed',
        //     active: false,
        //     currentItem: 'Any',
        //     items: [],
        // },
        // {
        //     name: 'Size',
        //     id: 'size',
        //     active: false,
        //     currentItem: 'Any',
        //     items: [
        //         { name: 'Any', id: '' },
        //         { name: 'Small', id: 'small' },
        //         { name: 'Medium', id: 'medium' },
        //         { name: 'Large', id: 'large' },
        //         { name: 'Extra Large', id: 'xlarge' }
        //     ],
        // },
        // {
        //     name: 'Age',
        //     id: 'age',
        //     active: false,
        //     currentItem: 'Any',
        //     items: [
        //         { name: 'Any', id: '' },
        //         { name: 'Baby', id: 'baby' },
        //         { name: 'Young', id: 'young' },
        //         { name: 'Adult', id: 'adult' },
        //         { name: 'Senior', id: 'senior' }
        //     ],
        // }
    ]
}

export class FilterListItem {
    items: any;

    constructor(obj: object[]) {
        this.items = obj.map(x => { })
    }
}

export class FilterItem {
    name: string;
    id: string;
    active: boolean;
    currentItem: any;
    items: object[];

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.active = false;
        this.currentItem = 'Any';
        this.items = [];
    }
}

