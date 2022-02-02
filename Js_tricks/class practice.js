class User {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    sayHi(){
        if (this.gender==`Male`) var HESHE = `He`
        if (this.gender==`Female`) var HESHE = `She`
        console.log(`${this.name} says Hi, ${HESHE} mention today is ${this.age}'s birthday` )
    }
}

let user = new User(`John`, 32, `Male` )
let user2 = new User(`Serena`, 27, `Female` )
user.sayHi()
user2.sayHi()