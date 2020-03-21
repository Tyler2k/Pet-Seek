export class PetModel {
    age: string;
    type: string;
    breed: string;
    contact: ContactInfo;
    description: string;
    id: string;
    lastUpdate: string;
    publishedDate: string;
    photos: string[];
    featuredPhoto: string;
    tagLine: string;
    mix: string;
    name: string;
    moreInfo: string[];
    gender: string;
    shelterId: string;
    //shelterPetId: string;
    size: string;
    status: string;
    location: string;
    thumbnail: string;
    isFavorite: boolean;
    dislikes: string;
    distance: number;

    constructor(pet: any, favorites: PetModel[]) {
        this.age = pet.age;
        this.type = pet.type;
        this.breed = this.getBreed(pet.breeds);
        this.contact = new ContactInfo(pet.contact);
        this.description = pet.description;
        this.id = pet.id;
        this.lastUpdate = pet.status_changed_at;
        this.publishedDate = pet.published_at;
        this.photos = pet.photos.length ? this.getPhotos(pet.photos) : null;
        this.thumbnail = pet.photos.length ? this.getThumbnailPhoto(pet.photos) : null;
        this.mix = pet.breeds.mixed;
        this.name = pet.name;
        this.gender = pet.gender;
        this.shelterId = pet.organization_id;
        //this.shelterPetId = pet.shelterPetId['$t'];
        this.size = pet.size;
        this.status = pet.status;
        this.tagLine = this.formatTagline([this.gender, this.age, this.size]);
        this.location = this.formatLocation(this.contact);
        this.isFavorite = this.isPetFavorited(this.id, favorites);
        this.distance = pet.distance;
        if (pet.attributes) {
            this.translateOptions(pet.attributes, this.gender)
        }
    }

    private isPetFavorited(petId: string, favorites: any[]) {
        return favorites.find(pet => {
            return pet.id == petId;
        })
    }

    private formatTagline(arr: string[]) {
        return arr.map(r => {
            return r;
        }).join(' &middot; ');
    }

    // private getStatus(statusId: string) {
    //     switch (statusId) {
    //         case 'A':
    //             return 'Adoptable';
    //         case 'H':
    //             return 'Hold';
    //         case 'P':
    //             return 'Pending';
    //         case 'X':
    //             return 'Adopted';
    //     }
    // }

    private translateOptions(items: any, gender: string = null) {
        let moreInfoItems = [];
        let dislikeItems = [];
        let attributes = [];
        for (let x in items) {
            if (items[x]) {
                attributes.push(x);
            }
        }

        if (attributes.length) {
            attributes.forEach(i => {
                translate(i, gender);
            });
        }
        

        this.moreInfo = moreInfoItems;
        this.dislikes = dislikeItems.join(', ');
        console.log(moreInfoItems)

        function translate(value: string, gender: string = null) {
            switch (value) {
                case ('spayed_neutered'):
                    moreInfoItems.push(gender == 'Female' ? 'Spayed' : 'Neutered');
                    break;
                case ('house_trained'):
                    moreInfoItems.push('House Trained');
                    break;
                case ('shots_current'):
                    moreInfoItems.push('Shots Current');
                    break;
                case ('special_needs'):
                    moreInfoItems.push('Special Needs');
                    break;
                case ('noCats'):
                    dislikeItems.push('Cats');
                    break;
                case ('noDogs'):
                    dislikeItems.push('Dogs');
                    break;
                case ('noKids'):
                    dislikeItems.push('Kids');
                    break;
                default:
                    break;
            }
        }
    }

    private getPhotos(photos: any[]) {
        let slidePhotos = [];
        for (let p of photos) {
            slidePhotos.push(p.medium);
        }
        return slidePhotos;
    }

    private getThumbnailPhoto(photos: any[]) {
        return photos[0].small;
    }

    private getBreed(breeds: object[]) {
        return breeds['primary'];
        // return breeds.map(r => {
        // 	return r['$t'];
        // }).join(' / ');
    }

    private formatLocation(contact: ContactInfo) {
        return contact.city + ', ' + contact.state;
    }
}

export class PetQueryResponse {
    //lastOffset: string;
    pets: PetModel[];

    constructor(response: any, favorites: any) {
        //this.lastOffset = response.petfinder.lastOffset['$t'];
        this.pets = this.formatPets(response.animals, favorites);
    }

    private formatPets(pets: PetModel[], favorites: any) {
        for (let i = 0; i < pets.length; i++) {
            pets[i] = new PetModel(pets[i], favorites);
        }
        return pets;
    }
}

export class PetQueryRequest {
    type: string;
    breed: string;
    size: string;
    gender: string;
    location: string;
    age: string;
    page: number;
    limit: number;

    constructor(type: string = null, breed: string = null, size: string = null, gender: string = null, location: string = null, age: string = null, page: number = null, limit: number = 25) {
        this.type = type;
        this.breed = breed;
        this.size = size;
        this.gender = gender;
        this.location = location;
        this.age = age;
        this.page = page;
        this.limit = limit;
    }
}

export class BreedListResponse {
    breeds: string[];

    constructor(response: any) {
        let breedList = response.breeds;
        this.breeds = breedList.map(obj => obj.name);
        this.breeds.unshift('Any');
    }
}

export class PetRandomQueryRequest {
    animal: string;
    breed: string;
    size: string;
    gender: string;
    location: string;
    shelterid: string;
}

export class ShelterQueryRequest {
    location: string;
    name: string;
    offset: string;
    count: string;
}

export class ContactInfo {
    address1: string;
    address2: string;
    city: string;
    email: string;
    //fax: string;
    phone: string;
    state: string;
    zip: string;

    constructor(info: any) {
        this.address1 = info.address.address1;
        this.address2 = info.address.address2;
        this.city = info.address.city;
        this.email = info.email;
        //this.fax = info.fax['$t'];
        this.phone = info.phone;
        this.state = info.address.state;
        this.zip = info.address.postalCode;
    }
}

export class PetMedia {
    size: string;
    id: string;
    url: string;

    constructor(media) {
        this.size = media['@size'];
        this.id = media['@id'];
        this.url = media['$t'];
    }
}