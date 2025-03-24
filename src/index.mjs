import  express from "express";
import { USERS } from "./json/users.mjs";
import { BANKS } from "./json/banks.mjs";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// port for server
const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
    response.status(200).send({msg: "Hello!"})
});

app.get("/api/users", (request, response) => {
    const {query: {queryKey, queryValue}} = request;
    if (!!queryKey && !!queryValue) {
        return response.status(200).send(
            USERS.filter(user => user[queryKey].toLowerCase().includes(queryValue.toLowerCase()))
        );
    }
    return response.status(200).send(USERS);
});

app.get("/api/user/:id", (request, response) => {
    console.log(request.params.id);
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(400).send({msg: "Bad Request, Invalid ID"});
    }
    const user = USERS.find(user => user.id === id);
    if (!user) {
        return response.status(200).send({msg: "User Not Found with ID" });
    }
    return response.status(200).send({user});
});

app.post("/api/user", (request, response) => {
    const user = request.body;
    console.log(user);
    if (!user) {
        return response.status(400).send({msg: "User details not found"});
    }
    if (user.id) {
        return response.status(400).send({msg: "User id should not send"});
    }
    if (!user.email || !user.first_name || !user.last_name || !user.address) {
        return response.status(400).send({msg: "required field are missing!. email, first_name, last_name and address are required fields!"});
    }
    if (USERS.find(duser => duser.email === user.email)) {
        return response.status(400).send({msg: "User is already exist with email " + user.email});
    }
    USERS.push({id: USERS[USERS.length - 1].id + 1, ...user});
    response.status(200).send({msg: "Successfully added!"});
});

app.put("/api/user", (request, response) => {
    const user = request.body;
    console.log(user) ;
    if (!user) {
        return response.status(400).send({msg: "User details not found"});
    }
    const currentUserInd = USERS.findIndex(duser => duser.id == user.id);
    if (currentUserInd < 0) {
        return response.status(400).send({msg: "User details not found"});
    }
    if (!user.id && !user.email || !user.first_name || !user.last_name || !user.address) {
        return response.status(400).send({msg: "required field are missing!. id, email, first_name, last_name and address are required fields!"});
    }
    if (USERS.find(duser => duser.id !== user.id && duser.email === user.email)) {
        return response.status(400).send({msg: "User is already exist with email " + user.email});
    }
    USERS.splice(currentUserInd, 1, user);
    response.status(200).send({msg: "Successfully updated!"});
});
app.delete("/api/user/:id", (request, response) => {
    const {params: {id}} = request;
    const pid = parseInt(id);
    // console.log(user) ;
    if (!id || isNaN(pid)) {
        return response.status(400).send({msg: "User details not found"});
    }
    const currentUserInd = USERS.findIndex(duser => duser.id == pid);
    if (currentUserInd < 0) {
        return response.status(400).send({msg: "User details not found"});
    }
    USERS.splice(currentUserInd, 1);
    console.log(USERS);
    response.status(200).send({msg: "Successfully delete!"});
});

// banking application -------------------- start ----------------------
// {
//     "accountType": "savings", // "checking",
//     "startDate": "2025-03-24",
//     "endDate": "2025-03-27",
//     "bankCountry": "Canada",
//     "bankAccount": "asdasdf",
//     "postalCode": "as",
//     "city": "asdfasdf sdfasdf"
// }
app.get("/api/getBanks", (request, response) => {
    const {query: {queryKey, queryValue}} = request;
    if (!!queryKey && !!queryValue) {
        return response.status(200).send(
            BANKS.filter(bank => bank[queryKey].toLowerCase().includes(queryValue.toLowerCase()))
        );
    }
    return response.status(200).send(BANKS);
});

app.get("/api/bank/:id", (request, response) => {
    console.log(request.params.id);
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(400).send({msg: "Bad Request, Invalid ID"});
    }
    const bank = BANKS.find(bank => bank.id === id);
    if (!bank) {
        return response.status(200).send({msg: "BANK Not Found with ID" });
    }
    return response.status(200).send({bank});
});

app.post("/api/addBank", (request, response) => {
    const bank = request.body;
    console.log(bank);
    if (!bank) {
        return response.status(400).send({msg: "BANK details not found"});
    }
    if (bank.id) {
        return response.status(400).send({msg: "BANK id should not send"});
    }
    // if (!bank.email || !bank.first_name || !bank.last_name || !bank.address) {
    //     return response.status(400).send({msg: "required field are missing!. email, first_name, last_name and address are required fields!"});
    // }
    // if (BANKS.find(duser => duser.email === bank.email)) {
    //     return response.status(400).send({msg: "BANK is already exist with email " + bank.email});
    // }
    BANKS.push({id: BANKS[BANKS.length - 1].id + 1, ...bank});
    response.status(200).send({msg: "Successfully added!"});
});

app.put("/api/updateBank", (request, response) => {
    const bank = request.body;
    console.log(bank) ;
    if (!bank) {
        return response.status(400).send({msg: "BANK details not found"});
    }
    const currentUserInd = BANKS.findIndex(duser => duser.id == bank.id);
    if (currentUserInd < 0) {
        return response.status(400).send({msg: "BANK details not found"});
    }
    // if (!bank.id && !bank.email || !bank.first_name || !bank.last_name || !bank.address) {
    //     return response.status(400).send({msg: "required field are missing!. id, email, first_name, last_name and address are required fields!"});
    // }
    // if (BANKS.find(dbank => dbank.id !== bank.id && dbank.email === bank.email)) {
    //     return response.status(400).send({msg: "bank is already exist with email " + bank.email});
    // }
    BANKS.splice(currentUserInd, 1, bank);
    response.status(200).send({msg: "Successfully updated!"});
});
app.delete("/api/removeBank/:id", (request, response) => {
    const {params: {id}} = request;
    const pid = parseInt(id);
    // console.log(user) ;
    if (!id || isNaN(pid)) {
        return response.status(400).send({msg: "BANK details not found"});
    }
    const currentUserInd = BANKS.findIndex(duser => duser.id == pid);
    if (currentUserInd < 0) {
        return response.status(400).send({msg: "BANK details not found"});
    }
    BANKS.splice(currentUserInd, 1);
    console.log(BANKS);
    response.status(200).send({msg: "Successfully delete!"});
});


// banking application ------------------------------------------ end -------------------------------------


app.listen(PORT, () => {
    console.log("Running on Prot " + PORT);
});