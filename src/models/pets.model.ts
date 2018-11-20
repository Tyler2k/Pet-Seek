import { AfterViewChecked } from '@angular/core';

export class PetModel {
	age: string;
	animal: string;
	breeds: string;
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

	constructor(pet) {
		this.age = pet.age['$t'];
		this.animal = pet.animal['$t'];
		this.breeds = pet.breeds.breed['$t'];
		this.contact = new ContactInfo(pet.contact);
		this.description = pet.description['$t'];
		this.id = pet.id['$t'];
		this.lastUpdate = pet.lastUpdate['$t'];
		this.photos = pet.media.photos ? this.formatArray(pet.media.photos.photo, true) : null;
		this.featuredPhoto = pet.media.photos ? this.getFeaturedPhoto(pet.media.photos.photo) : null;
		this.mix = pet.mix['$t'];
		this.name = pet.name['$t'];
		this.options = pet.options.option ? this.formatArray(pet.options.option) : null;
		this.sex = this.getGender(pet.sex['$t']);
		this.shelterId = pet.shelterId['$t'];
		this.shelterPetId = pet.shelterPetId['$t'];
		this.size = this.getSize(pet.size['$t']);
		this.status = this.getStatus(pet.status['$t']);
		this.tagLine = this.formatTagline(this.age, this.breeds, this.sex);
		this.location = this.formatLocation(this.contact)
	}

	private formatTagline(age: string = null, breeds: string = null, sex: string = null) {
		let tagLine = "";
		if (age) {
			tagLine += age;
		}
		if (sex) {
			tagLine ? tagLine += " - " + sex : tagLine += sex;
		}
		return tagLine;
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

	private formatArray(items, photos: boolean = false) {
		if (!items.length && photos) {
			items = new PetMedia(items)
		} else {
			for (let i = 0; i < items.length; i++) {
				photos ? items[i] = new PetMedia(items[i]) : items[i] = items[i]['$t'];
			}
		}
		return items;
	}

	private getFeaturedPhoto(photos: PetMedia[]) {
		for (let p of photos) {
			if (p.size == 'pn' && p.id == '1') {
				return p.url;
			}
		}
	}

	private formatLocation(contact: ContactInfo) {
		return contact.city + ", " + contact.state;
	}
}

export class PetQueryResponse {
	lastOffset: string;
	pets: PetModel[];

	constructor(response) {
		this.lastOffset = response.petfinder.lastOffset['$t'];
		this.pets = this.formatPets(response.petfinder.pets.pet);
	}

	private formatPets(pets: PetModel[]) {
		for (let i = 0; i < pets.length; i++) {
			pets[i] = new PetModel(pets[i]);
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

	constructor(animal: string = null, breed: string = null, size: string = null, sex: string = null, location: string = null, age: string = null, offset: string = null, count: number = 20) {
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