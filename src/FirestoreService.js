import { db } from './firebase'

function getAllCompany() {
    return new Promise((resolve, reject) => {
        db.collection("Company").get().then((allCompany) => {
            resolve(allCompany);
        }).catch((e) => {
            reject(e);
        })
    })
}

function getAllCompanyType() {
    return new Promise((resolve, reject) => {
        db.collection("CompanyType").get().then((allCompanyType) => {
            resolve(allCompanyType);
        }).catch((e) => {
            reject(e);
        })
    })
}

function AddNewCompany(CompanyType, addressStreet, addressTown, name, shortName) {
    return new Promise((resolve, reject) => {
        const data = {
            "CompanyType": CompanyType,
            "addressStreet": addressStreet,
            "addressTown": addressTown,
            "name": name,
            "shortName": shortName,
        }

        db.collection("Company").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}

function UpateCompany(CompanyID, CompanyType, addressStreet, addressTown, name, shortName) {

    return new Promise((resolve, reject) => {

        const data = {
            "CompanyType": CompanyType,
            "addressStreet": addressStreet,
            "addressTown": addressTown,
            "name": name,
            "shortName": shortName,
        }

        db.collection("Company").doc(CompanyID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

function DeleteCompany(CompanyID) {
    return new Promise((resolve, reject) => {
        db.collection("Company").doc(CompanyID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}








function getAllTown() {
    return new Promise((resolve, reject) => {
        db.collection("Town").get().then((allTown) => {
            resolve(allTown);
        }).catch((e) => {
            reject(e);
        })
    })
}

function getAllTownName() {
    return new Promise((resolve, reject) => {
        db.collection("townName").get().then((allTownName) => {
            resolve(allTownName);
        }).catch((e) => {
            reject(e);
        })
    })
}

function AddNewTown(townName, region, city) {
    return new Promise((resolve, reject) => {
        const data = {
            "townName": townName,
            "addressStreet": region,
            "addressTown": city,
        }

        db.collection("Town").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}

function UpateTown(TownID, townName, region, city) {

    return new Promise((resolve, reject) => {

        const data = {
            "townName": townName,
            "addressStreet": region,
            "addressTown": city,
        }

        db.collection("Town").doc(TownID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

function DeleteTown(TownID) {
    return new Promise((resolve, reject) => {
        db.collection("Town").doc(TownID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}






function getAllDepartment() {
    return new Promise((resolve, reject) => {
        db.collection("Department").get().then((allDepartment) => {
            resolve(allDepartment);
        }).catch((e) => {
            reject(e);
        })
    })
}

function getAllDepartmentType() {
    return new Promise((resolve, reject) => {
        db.collection("DepartmentType").get().then((allDepartmentType) => {
            resolve(allDepartmentType);
        }).catch((e) => {
            reject(e);
        })
    })
}

function AddNewDepartment(DepartmentType, addressStreet, addressTown, companyName, departmentName) {
    return new Promise((resolve, reject) => {
        const data = {
            "DepartmentType": DepartmentType,
            "addressStreet": addressStreet,
            "addressTown": addressTown,
            "companyName": companyName,
            "departmentName": departmentName,
        }

        db.collection("Department").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}

function UpateDepartment(DepartmentID, DepartmentType, addressStreet, addressTown, companyName, departmentName) {

    return new Promise((resolve, reject) => {

        const data = {
            "DepartmentType": DepartmentType,
            "addressStreet": addressStreet,
            "addressTown": addressTown,
            "companyName": companyName,
            "departmentName": departmentName,
        }

        db.collection("Department").doc(DepartmentID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

function DeleteDepartment(DepartmentID) {
    return new Promise((resolve, reject) => {
        db.collection("Department").doc(DepartmentID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}





function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.collection("Users").get().then((allUsers) => {
            resolve(allUsers);
        }).catch((e) => {
            reject(e);
        })
    })
}


function AddNewUsers(name,department,email) {
    return new Promise((resolve, reject) => {
        const data = {
            "name": name,
            "department": department,
            "email": email,

        }

        db.collection("Users").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}

function UpateUsers(UsersID, name,department,email) {

    return new Promise((resolve, reject) => {

        const data = {
            "name": name,
            "department": department,
            "email": email,
        }

        db.collection("Users").doc(UsersID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

function DeleteUsers(UsersID) {
    return new Promise((resolve, reject) => {
        db.collection("Users").doc(UsersID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}









export default { getAllTown, getAllTownName, AddNewTown, UpateTown, DeleteTown, getAllCompany, getAllCompanyType, AddNewCompany, UpateCompany, DeleteCompany, getAllDepartment, getAllDepartmentType, AddNewDepartment, UpateDepartment, DeleteDepartment, getAllUsers, AddNewUsers, UpateUsers, DeleteUsers}