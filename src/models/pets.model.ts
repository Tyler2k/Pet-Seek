import { AfterViewChecked } from '@angular/core';

export class PetModel {
	age: string;
	animal: string;
	breed: string;
	contact: ContactInfo;
	description: string;
	id: string;
	lastUpdate: string;
	photos: string[];
	featuredPhoto: string;
	tagLine: string;
	mix: string;
	name: string;
	options: string[];
	sex: string;
	shelterId: string;
	shelterPetId: string;
	size: string;
	status: string;
	location: string;
	thumbnail: string;
	isFavorite: boolean;

	constructor(pet, favorites) {
		this.age = pet.age['$t'];
		this.animal = pet.animal['$t'];
		this.breed = this.getBreed(pet.breeds.breed);
		this.contact = new ContactInfo(pet.contact);
		this.description = pet.description['$t'];
		this.id = pet.id['$t'];
		this.lastUpdate = pet.lastUpdate['$t'];
		this.photos = pet.media.photos ? this.getPhotos(pet.media.photos.photo) : null;
		this.thumbnail = pet.media.photos ? this.getThumbnailPhoto(pet.media.photos.photo) : null;
		this.mix = pet.mix['$t'];
		this.name = pet.name['$t'];
		this.options = pet.options.option ? this.formatArray(pet.options.option) : null;
		this.sex = this.getGender(pet.sex['$t']);
		this.shelterId = pet.shelterId['$t'];
		this.shelterPetId = pet.shelterPetId['$t'];
		this.size = this.getSize(pet.size['$t']);
		this.status = this.getStatus(pet.status['$t']);
		this.tagLine = this.formatTagline([this.sex, this.age, this.size]);
		this.location = this.formatLocation(this.contact);
		this.isFavorite = this.isPetFavorited(this.id, favorites);
	}

	private isPetFavorited(petId: string, favorites) {
		return favorites.find(pet => {
			return pet.id == petId;
		})
	}

	private formatTagline(arr) {
		return arr.map(r => {
			return r;
		}).join(' &middot; ');
	}

	private getGender(genderId: string) {
		switch (genderId) {
			case "M":
				return "Male";
			case "F":
				return "Female";
		}
	}

	private getSize(sizeId: string) {
		switch (sizeId) {
			case "S":
				return "Small";
			case "M":
				return "Medium";
			case "L":
				return "Large";
			case "XL":
				return "Extra Large";
		}
	}

	private getStatus(statusId: string) {
		switch (statusId) {
			case "A":
				return "Adoptable";
			case "H":
				return "Hold";
			case "P":
				return "Pending";
			case "X":
				return "Adopted";
		}
	}

	private formatArray(items) {
		let arr = [];
		arr = arr.concat(items)
		for (let i = 0; i < arr.length; i++) {
			arr[i] = arr[i]['$t'];
		}
		return arr;
	}

	private getPhotos(photos: PetMedia[]) {
		let slidePhotos = [];
		for (let p of photos) {
			let photo = new PetMedia(p);
			if (photo.size == 'pn') {
				slidePhotos.push(photo.url);
			}
		}
		return slidePhotos;
	}

	private getThumbnailPhoto(photos: PetMedia[]) {
		for (let p of photos) {
			let photo = new PetMedia(p);
			if (photo.size == 'fpm') {
				return photo.url;
			}
		}
	}

	private getBreed(breeds: any) {
		let arr = [];
		arr = arr.concat(breeds)
		return arr.map(r => {
			return r['$t'];
		}).join(' / ');
	}

	private formatLocation(contact: ContactInfo) {
		return contact.city + ", " + contact.state;
	}
}

export class PetQueryResponse {
	lastOffset: string;
	pets: PetModel[];

	constructor(response, favorites: any) {
		this.lastOffset = response.petfinder.lastOffset['$t'];
		this.pets = this.formatPets(response.petfinder.pets.pet, favorites);
	}

	private formatPets(pets: PetModel[], favorites: any) {
		for (let i = 0; i < pets.length; i++) {
			pets[i] = new PetModel(pets[i], favorites);
		}
		return pets;
	}
}

export class PetQueryRequest {
	animal: string;
	breed: string;
	size: string;
	sex: string;
	location: string;
	age: string;
	offset: string;
	count: number;

	constructor(animal: string = null, breed: string = null, size: string = null, sex: string = null, location: string = null, age: string = null, offset: string = null, count: number = 25) {
		this.animal = animal;
		this.breed = breed;
		this.size = size;
		this.sex = sex;
		this.location = location;
		this.age = age;
		this.offset = offset;
		this.count = count;
	}
}

export class BreedListResponse {
	breeds: string[];

	constructor(response) {
		let breedList = response.petfinder.breeds.breed;
		this.breeds = breedList.map(obj => obj['$t']);
		this.breeds.unshift('Any');
	}
}

export class PetRandomQueryRequest {
	animal: string;
	breed: string;
	size: string;
	sex: string;
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
	fax: string;
	phone: string;
	state: string;
	zip: string;

	constructor(info: ContactInfo) {
		this.address1 = info.address1['$t'];
		this.address2 = info.address2['$t'];
		this.city = info.city['$t'];
		this.email = info.email['$t'];
		this.fax = info.fax['$t'];
		this.phone = info.phone['$t'];
		this.state = info.state['$t'];
		this.zip = info.zip['$t'];
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