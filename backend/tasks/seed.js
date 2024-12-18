import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from "../db/users.js"
import posts from "../db/posts.js"
import { image1, image2 } from './images.js';



//IDS AND EMAIL LINKS   

// lVDhUroqA6cmi7jFle3GuUZa9ln1
// testing1@gmail.com
// testing123


//DTXnNCAWQSSM5fuoqro04uUg3d33
// testing2@gmail.com
// testing21

//PhJkWuA2c6hgSeKEmhDd0VoFoY33
//testing3@gmail.com
//anothertest123

const db = await dbConnection();
await db.dropDatabase();

let firstPost = ""
let secPost = ""

const seedUsers = async () => {
    try {
        const rep = await users.addUserIfNotExists("lVDhUroqA6cmi7jFle3GuUZa9ln1")
        await users.updateUserProfile("lVDhUroqA6cmi7jFle3GuUZa9ln1", {
            displayName: "The First User",
            zipCode: "90001",
            bio: "I am a fellow traveller!"
        })
        console.log("done")

    } catch (e) {
        console.log(e)
    }

    try {
        const rep = await users.addUserIfNotExists("DTXnNCAWQSSM5fuoqro04uUg3d33")
        const change = await users.updateUserProfile("DTXnNCAWQSSM5fuoqro04uUg3d33", {
            displayName: "Second User",
            zipCode: "77002",
            bio: "I am a fellow traveller!"
        })

    } catch (e) {
        console.log(e)
    }

    try {
        const rep = await users.addUserIfNotExists("PhJkWuA2c6hgSeKEmhDd0VoFoY33")
        const change = await users.updateUserProfile("PhJkWuA2c6hgSeKEmhDd0VoFoY33", {
            displayName: "Third User",
            zipCode: "10001",
            bio: "I am a fellow traveller!"
        })


    } catch (e) {
        console.log(e)
    }
}

const seedPlaces = async () => {
    try {
        await posts.addPost("lVDhUroqA6cmi7jFle3GuUZa9ln1",
            "I absolutely loved coming here, seeing the views seriously made my day! Take a look for yourself!",
            image1,
            "The High Line",
            "12/01/2024",
            9.5,
            "JION8hhg7q6zyayHYwhxIw"
        )

        await users.addPlaceForUser(
            "lVDhUroqA6cmi7jFle3GuUZa9ln1",
            "JION8hhg7q6zyayHYwhxIw",
            false,
            true,
            "The High Line",
            image1,
            "New York, NY 10011",
            "New York",
            "NY",
            9.5
        );


    } catch (e) {
        console.log(e)
    }

    try {
        await posts.addPost("DTXnNCAWQSSM5fuoqro04uUg3d33",
            "Just spent a decent day at Bryant park. I will say that while it was enjoyable, it was super crowded. Don't come here during the winter.",
            "",
            "Bryant Park",
            "12/03/2024",
            6.5,
            "MJJi_5tGkWYI1VReTjhCCA"
        )

        await users.addPlaceForUser(
            "DTXnNCAWQSSM5fuoqro04uUg3d33",
            "MJJi_5tGkWYI1VReTjhCCA",
            false,
            true,
            "Bryant Park",
            "",
            "41 W 40th St New York, NY 10018",
            "New York",
            "NY",
            6.5
        );
    } catch (e) {
        console.log(e)
    }



    try {
        await posts.addPost("lVDhUroqA6cmi7jFle3GuUZa9ln1",
            "Just spent an amazing day at Buffalo Bayou Park. From the lush greenery to the stunning views of the skyline, this park perfectly blends nature and city life. Whether you're walking along the trails, enjoying a picnic, or taking a leisurely paddle on the bayou, there's something for everyone here. I am grateful for moments like these that remind us to slow down and appreciate the beauty around us.",
            "",
            "Buffalo Bayou Park",
            "12/03/2024",
            8.3,
            "pxeRqY438fOcEJmw9ceAug"
        )

        await users.addPlaceForUser(
            "lVDhUroqA6cmi7jFle3GuUZa9ln1",
            "pxeRqY438fOcEJmw9ceAug",
            false,
            true,
            "Buffalo Bayou Park",
            "",
            "105-B Sabine St Houston, TX 77007",
            "Houston",
            "TX",
            8.3
        );
    } catch (e) {
        console.log(e)
    }

    try {
        const p = await posts.addPost("PhJkWuA2c6hgSeKEmhDd0VoFoY33",
            "The view here was sooooo pretty! I loved the hustle and bustle and my entire travel party marked this as one of their favorite places!",
            "",
            "The High Line",
            "12/10/2024",
            9.2,
            "JION8hhg7q6zyayHYwhxIw"
        )
        firstPost = p._id
        await users.addPlaceForUser(
            "PhJkWuA2c6hgSeKEmhDd0VoFoY33",
            "JION8hhg7q6zyayHYwhxIw",
            false,
            true,
            "The High Line",
            "",
            "New York, NY 10011",
            "New York",
            "NY",
            9.2
        );

    } catch (e) {
        console.log(e)
    }

    try {
        await posts.addPost("DTXnNCAWQSSM5fuoqro04uUg3d33",
            "LOVED my time here!! Perfect way to see the Grand Canyon, loved all of the views. Will definitely come back!",
            image2,
            "Desert View Drive",
            "12/14/2024",
            10.0,
            "EQTbrvMTbY_QXoZaHwboCQ"
        )

        await users.addPlaceForUser(
            "DTXnNCAWQSSM5fuoqro04uUg3d33",
            "EQTbrvMTbY_QXoZaHwboCQ",
            false,
            true,
            "Desert View Drive",
            image2,
            "Grand Canyon, AZ 86023",
            "Grand Canyon",
            "AZ",
            10.0
        );



    } catch (e) {
        console.log(e)
    }

    try {
        const resp = await posts.addPost("PhJkWuA2c6hgSeKEmhDd0VoFoY33",
            "This park was pretty nice. Had a fun time hanging out with friends in the area. Is a little noisy though so beware.",
            "",
            "Mountain's Edge Regional Park",
            "12/19/2024",
            7.5,
            "Y5fqgeZXJqv2k0M2tHj0ag"
        )

        secPost = resp._id

        await users.addPlaceForUser(
            "PhJkWuA2c6hgSeKEmhDd0VoFoY33",
            "Y5fqgeZXJqv2k0M2tHj0ag",
            false,
            true,
            "Mountain's Edge Regional Park",
            "",
            "7929 W Mountains Edge Pkwy Las Vegas, NV 89178",
            "Las Vegas",
            "NV",
            7.5
        );


    } catch (e) {
        console.log(e)
    }

}

const seedComments = async () => {
    try {
        await posts.addComment(firstPost.toString(), "DTXnNCAWQSSM5fuoqro04uUg3d33", "Wow! Love that place!", 'Second User')
        await posts.addComment(secPost.toString(), "lVDhUroqA6cmi7jFle3GuUZa9ln1", "Wow! I went there too!", 'First User')
    } catch (e) {
        console.log(e)
    }
}



await seedUsers()
await seedPlaces()
await seedComments()
await closeConnection();
// process.exit(0)