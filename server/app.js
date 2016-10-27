"use strict";

let express = require("express");
let app = express();
let mongoUtil = require("./mongoUtil");
mongoUtil.connect();
app.use(express.static(__dirname + "/../client"));


let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

// helper functions for validation, perhaps extract them into another file
// thanks to the developer of Javascript, one function can return two different types of results
function isPositiveInt(object) {
    let intObject = parseInt(object);
    if (!intObject || intObject < 1) {
        return false;
    }
    return intObject;
}
// people related
// display the list of names of people
app.get("/peopleNames", (request, response) => {
    let people = mongoUtil.people();
    people.find({ pending: { $ne: 1 } }).toArray((err, docs) => {
        if (err) {
            response.sendStatus(400);
        }
        console.log(JSON.stringify(docs));
        let peopleNames = docs.map((people) => people.name);
        response.json(peopleNames);
    })
});
// display all the information of people
app.get("/people", (request, response) => {
    let people = mongoUtil.people();
    people.find({ pending: { $ne: 1 } }).toArray((err, docs) => {
        if (err) {
            response.sendStatus(400);
        }

        response.json(docs);
    })
});

// display info of one person using name or id
app.get("/people/:name", (request, response) => {
    let personName = request.params.name;
    let personID = parseInt(personName); // if success this is actually the id of that person
    let people = mongoUtil.people();
    // if the passed in parameter is an id
    if (isPositiveInt(personName)) {
        people.find({ _id: personID }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            console.log("Person doc: ", doc);

            response.json(doc);
        })

    }
    // if the passed in parameter is a name
    else {
        people.find({ name: personName }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            console.log("Person doc: ", doc);

            response.json(doc);
        })


    }

});

// find all the pictures of a person 
app.get("/people/:id/pictures", (request, response) => {

    let people = mongoUtil.people();
    let personID = parseInt(request.params.id);
    if (isPositiveInt(request.params.id)) {
        people.find({ _id: personID }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            let pictures = doc.picture;
            console.log("Person pictures: ", pictures);

            response.json(pictures);
        })


    }
    else {
        people.find({ name: request.params.id }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            let pictures = doc.picture;
            console.log("Person pictures: ", pictures);

            response.json(pictures);
        })



    }

});

// find a random picture from a person

app.get("/people/:id/picture", (request, response) => {

    let people = mongoUtil.people();
    let personID = parseInt(request.params.id);
    if (isPositiveInt(request.params.id)) {
        people.find({ _id: personID }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            let pictures = doc.picture;
            let index = parseInt(Math.random() * pictures.length);
            console.log(index);


            response.json(pictures[index]);
        })


    }
    else {
        people.find({ name: request.params.id }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            let pictures = doc.picture;
            let index = parseInt(Math.random() * pictures.length);
            console.log(index);

            response.json(pictures[index]);
        })



    }

});



// organization related
// display all the org names
app.get("/organizationNames", (request, response) => {
    let organizations = mongoUtil.organizations();
    organizations.find().toArray((err, docs) => {
        if (err) {
            response.sendStatus(400);
        }
        console.log(JSON.stringify(docs));
        let organizationsNames = docs.map((organizations) => organizations.name);
        response.json(organizationsNames);
    })
});
// display all the org info
app.get("/organizations", (request, response) => {
    let organizations = mongoUtil.organizations();
    organizations.find().toArray((err, docs) => {
        if (err) {
            response.sendStatus(400);
        }

        response.json(docs);
    })
});
// display the info of one org by id. This is also used in organization client app
// with a different query
app.get("/organizations/:id", (request, response) => {
    let organizations = mongoUtil.organizations();
    let organizationID = parseInt(request.params.id);
    if (isPositiveInt(request.params.id)) {
        organizations.find({ _id: organizationID }).limit(1).next((err, doc) => {
            if (err) {
                response.sendStatus(400);
            }
            console.log("Org doc: ", doc);
            // filter the doc

            // search the people collection
            // if it is pending, don't show it



            response.json(doc);
        })

    }
    // if the input is not a number
    else {
        console.log("Not Number " + organizationID);
        response.sendStatus(400);

    }


});

// update the current amount of donation to a project
// the update format
let format = { "_id": "$id", "amount": "$amount" };

app.post("/organizations/:id/donate", jsonParser, (request, response) => {
    let organizationID = parseInt(request.params.id);
    if (!organizationID) {
        // if the organizationID is invalid, return bad request
        response.sendStatus(400);
    }
    else {
        let newDonate = request.body || {};
        // if there is anything missing in the response, return bad request
        // since the helper function checks positive, but 0 works here, add 1 to circumvent the check
        if (!isPositiveInt(newDonate._id + 1) || !(newDonate.amount > 0)) {
            response.sendStatus(400);
        }
        else {
            let donationID = newDonate._id;
            let amount = newDonate.amount;
            console.log(organizationID);
            console.log(donationID);
            console.log(amount);
            // try to update the db
            let organization = mongoUtil.organizations();
            // try to find the corresponsing organizationID
            organization.find({ _id: organizationID }).limit(1).next((err, doc) => {
                if (err) {
                    response.sendStatus(400);
                }
                else {
                    let donationGoals = doc.donation_goals;
                    // try to find the corresponsing donation goal
                    if (!donationGoals[donationID]) { // no need to check exception
                        response.sendStatus(400);


                    }
                    else {
                        let total = donationGoals[donationID].total;
                        let current = donationGoals[donationID].current;
                        if (!current) {
                            donationGoals[donationID].current = 0;
                        }


                        // try to finish the donation. Questions about over donation/ concurrency issues
                        console.log(doc);
                        doc.donation_goals[donationID].current += amount;
                        console.log(doc);
                        organization.findOneAndUpdate({ _id: organizationID }, doc, (err, res) => {
                            if (err) {
                                response.sendStatus(400);
                            }
                            else {
                                /*if (current >= total) {
                                    response.send("We have reached our goal, and we don't need your donation at this time. Thank you anyway.");

                                }
                                else if (current + amount > total) {
                                    response.send("Congractulations! Your donation of 100 helps us reached our goal. Thank you. Only 100 is charged. ")
                                }
                                else {
                                    response.send("We have received your donation. Thank you.")
                                }*/
                                response.sendStatus(201);

                            }

                        });
                    }

                }
            });

        }

    }
});

let formatPeople = { "name": "test", "needs": "needs", "picture": "test1.jpg", "organization": 1 };
// add a new homeless into the database with a pending state
app.post("/people/new", jsonParser, (request, response) => {

    // validate request. I think the name and organization name is only required
    if (!request.body.name || !request.body.organization) {
        response.sendStatus(400);
    }
    // validate organization
    else {
        let org = request.body.organization;
        if (!isPositiveInt(org)) {
            response.sendStatus(400);
        }
        else {
            let orgID = parseInt(org);
            // find the corresponsing organization
            let organization = mongoUtil.organizations();
            organization.find({ _id: orgID }).limit(1).next((err, doc) => {
                if (err) {
                    response.sendStatus(400);
                }
                else {
                    // if(!doc){
                    //      response.sendStatus(400);
                    // }


                    // could pending the new homeless at this time
                    // post to database with pending:1
                    let people = mongoUtil.people();
                    // find the current max id
                    var maxID = -1;
                    people.find().sort({ _id: -1 }).limit(1).next((err, doc) => {
                        if (err) {
                            response.sendStatus(400);

                        }
                        else {
                            console.log("1:" + doc._id); // this line runs second
                            maxID = doc._id + 1;
                            console.log("3:" + maxID); // this is the correct id

                            let insDoc = {
                                _id: maxID, name: request.body.name,
                                needs: request.body.needs, picture: request.body.picture,
                                pending: 1
                            };
                            people.insert(insDoc, (err) => {
                                if (err) {
                                    response.sendStatus(400);
                                }
                                else {
                                    response.sendStatus(201);

                                }
                            });
                            // just insert to the organization, even if it is in pending state
                            // the organization will know it
                            organization.findOneAndUpdate({ _id: orgID },
                                { $push: { "featured_residents": maxID } }, (err) => {
                                    if (err) {
                                        response.sendStatus(400);
                                    }
                                });




                        }

                    });
                    console.log("2:" + maxID); // this line runs first


                }

            });


        }



    }




});
// functions to be performed on organization client side

// this function has multiple use cases:
// confirm a pending homeless, if the pending tag is 1
// can also use this function to add a new homeless, if the id passed in is a negative number
// can also use this function to modify a new homeless, if the id passed is valid
// for this function uses the same format as normal database entry for people collection
app.post("/people/:id/update", jsonParser, (request, response) => {
    // fetch the people
    let people = mongoUtil.people();
    let organization = mongoUtil.organizations();
    let newPeople; // a flag for new people or not
    let id = isPositiveInt(request.params.id); // this degrades to a type converter
    people.find({ _id: id }).limit(1).next((err, doc) => {
        if (err) {
            response.sendStatus(400); // this is truly error
        }
        if (doc) {
            newPeople = false;
        }
        else {
            newPeople = true;
        }
        // modify any info of that people
        // set pending to 0

        // get the correct id
        // if this is indeed a new people, calculate the id to be added
        if (newPeople) {
            people.find().sort({ _id: -1 }).limit(1).next((err, doc) => {
                if (err) {
                    response.sendStatus(400);

                }
                else {
                    id = doc._id + 1;
                    console.log(id);
                    // insert the people directly to people collection
                    let insDoc = {
                        _id: id,
                        name: request.body.name,
                        story: request.body.story,
                        needs: request.body.needs,
                        note: request.body.note,
                        donateURL: "http://123.123.123.123/" + id,
                        picture: request.body.picture // could be an array
                    };
                    people.insert(insDoc, (err) => {
                        if (err) {
                            response.sendStatus(400);
                        }
                        else {
                            response.sendStatus(201);

                        }

                    });
                    organization.findOneAndUpdate({ _id: request.body.organization },
                        { $push: { "featured_residents": id } }, (err) => {
                            if (err) {
                                response.sendStatus(400);
                            }
                        });

                }
            });
        }
        else {
            console.log(id);
            // update the people back to database with pending=0
            // this automatically clears the pending state
            let updateDoc = {
                _id: id,
                name: request.body.name,
                story: request.body.story,
                needs: request.body.needs,
                note: request.body.note,
                donateURL: "http://123.123.123.123/" + id,
                picture: request.body.picture // could be an array
            };

            people.findOneAndUpdate({ _id: id }, updateDoc, (err) => {
                if (err) {
                    response.sendStatus(400);
                }
                else {
                    response.sendStatus(201);

                }

            });
        }







    });









});
// delete a homeless, no matter if it is pending or not
// we can use delete route for deletes
app.delete("/people/:id/:orgID", (request, response) => {
    let people = mongoUtil.people();
    let id = isPositiveInt(request.params.id);
    let organization = mongoUtil.organizations();
    let orgID= isPositiveInt(request.params.orgID);
    // delete
    if (!id || !orgID ) {
        response.sendStatus(400);
    }
    people.remove({ _id: id }, (err) => {
        if (err) {
            response.sendStatus(400);
        }
        // remove the person from organization
        organization.find({ _id: orgID }).limit(1).next((err, doc) => {
            if(err){
                response.sendStatus(400);

            }
            else{
                let residents=doc["featured_residents"];
                let ind=residents.indexOf(id);
                console.log(ind);
                if(ind>-1){
                    residents.splice(ind,1);
                }
                doc["featured_residents"]=residents;
                organization.findOneAndUpdate({_id:orgID},doc,(err)=>{
                    if(err){
                        response.sendStatus(400);
                    }
                    else{
                         response.sendStatus(200);
                    }


                });
               

            }
        });


        

    })
});


// add a donation goal for organization
let donateFormat = { "name": "Laptop for job center", "total": 500 };
app.post("/organizations/:id/newgoal", jsonParser, (request, response) => {
    // find the organization
    let organization = mongoUtil.organizations();
    let id = isPositiveInt(request.params.id);
    if (!id) {
        response.sendStatus(400);

    }
    // no need to add the current field at this time. It will be added when posting a new donation
    organization.findOneAndUpdate({ _id: id }, { $push: { "donation_goals": request.body } }, (err) => {
        if (err) {
            response.sendStatus(400);

        }
        else {
            response.sendStatus(201);
        }

    });



});

// change the donation goal
app.post("/organizations/:id/:goalId",jsonParser,(request,response)=>{
    let organization = mongoUtil.organizations();
    let id = isPositiveInt(request.params.id);
    // intentionally divide this by 10, or it will not work
    let goalId = (isPositiveInt(request.params.goalId + 1) - 1) / 10; 
    console.log("orgID:" + id);
    console.log("goalID:" + goalId);
    // people.find({ _id: id }).limit(1).next((err, doc) => {
    organization.find({ _id: id }).limit(1).next((err, doc) => {
        if (err) {
            //console.log("Err:"+err);
            response.sendStatus(400);
        }
        else {

            let goals = doc["donation_goals"];
            // update the goal here
            goals[goalId-1]=request.body;

            doc["donation_goals"] = goals;
            console.log(doc);
            // update the organization
            organization.findOneAndUpdate({ _id: id }, doc, (err) => {
                if (err) {
                    response.sendStatus(400);

                }
                else {
                    response.sendStatus(201);
                }

            });
            

        }
    });


});



// delete a donation goal 
app.delete("/organizations/:id/:goalId", (request, response) => {
    let organization = mongoUtil.organizations();
    let id = isPositiveInt(request.params.id);
    let goalId = (isPositiveInt(request.params.goalId + 1) - 1) / 10;
    console.log("orgID:" + id);
    console.log("goalID:" + goalId);
    // people.find({ _id: id }).limit(1).next((err, doc) => {
    organization.find({ _id: id }).limit(1).next((err, doc) => {
        if (err) {
            //console.log("Err:"+err);
            response.sendStatus(400);
        }
        else {

            let goals = doc["donation_goals"];
            goals.splice(goalId - 1, 1);

            doc["donation_goals"] = goals;
            console.log(doc);
            // update the organization
            organization.findOneAndUpdate({ _id: id }, doc, (err) => {
                if (err) {
                    response.sendStatus(400);

                }
                else {
                    response.sendStatus(201);
                }

            });
            

        }
    });


});


app.listen(8181, () => console.log("Listening on 8181"));