/*
// Array destructing 
const alphabet = [`A`, `B`, `C`, `D`, `E`, `F`]
const numbers = [`1`, `2`, `3`, `4`, `5`, `6`]

//Basic Array destructuring
const [a, b, ...others] = alphabet
console.log(a)
console.log(b)
console.log(others)

//Combine arrays, by array destructuring and concat 
const CombineNewWay = [...alphabet, ...numbers]
const CombineOldWay = alphabet.concat(numbers)
console.log(CombineNewWay)
console.log(CombineOldWay)

// Array destructuring use case 
const sumAndMuti =(a, b)=> {
    return [a+b, a*b, a/b]
}
const [Sum, Mutiplier, NotExit = `Not here`] = sumAndMuti(2, 3)
console.log(Sum)
console.log(Mutiplier)
console.log(NotExit)
*/

const personOne = {
    name: `Michael`,
    age: 24,
    address: {
        city: `smalltown`,
        state: `One of them`
    }
}

const personTwo = {
    name: `Coco`,
    age: 30,
    address: {
        city:`BigTown`,
        state:`Another one`
    },
    Habit: {
        Morning:`Swiming`,
        Afternoon:`Weight-lefting`
    }
}

//Basic Destruting for Objects 
const { name: FirstName = 'NoName', age, address:{state, ...MoreAddress} , ...rest} = personTwo //Do not that ...will have all the undelared objects, as `MoreAddress` case 
console.log(FirstName)
console.log(age)
console.log(state)
console.log(MoreAddress)
console.log(rest)

const personThree = {...personOne, ...personTwo} //This will have personeOne info into the Object and have the psersonTwo to the same object and overwrite it
console.log(personThree)

const printUser =({name, age, Habit:{Morning=`basketball`}=`basketball`})=> { //take the Moring from nexted object 'Habit'
    console.log(`Name is : ${name}. Age is ${age} and the habit is ${Morning}`)
}

printUser(personOne)
printUser(`${personTwo}`)