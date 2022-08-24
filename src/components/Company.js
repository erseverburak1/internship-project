import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';
import NotLoggedInView from './NoLoggedInView';
import FirestoreService from '../services/firestoreService';
import imagee from "../images/image.jpg"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

function Company(props) {

    const [user, setUser] = useState(null);
    const [Company, setCompany] = useState([]);
    const [CompanyType, setCompanyType] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentCompany, setCurrentCompany] = useState({
        "CompanyType": '',
        "addressStreet": "",
        "addressTown": "",
        "name": "",
        "shortName": "",
    });
    const [currentCompanyId, setCurrentCompanyId] = useState("");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    })

    function fetchCompanyType() {
        setIsLoading(true);
        FirestoreService.getAllCompanyType().then((response) => {
            setIsLoading(false);
            setCompanyType(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the company type. " + e);
        })
    }

    function fetchCompany() {
        setIsLoading(true);
        FirestoreService.getAllCompany().then((response) => {
            setIsLoading(false);
            setCompany(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the company. " + e);
        })
    }

    useEffect(() => {
        if (user !== null) {
            if (CompanyType.length <= 0) {
                fetchCompanyType();
            }
            fetchCompany();
        }
    }, [user])

    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [addEditFormType, setAddEditFormType] = useState('Add'); //Add, Edit
    const [validated, setValidated] = useState(false);

    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setCurrentCompanyId("");
        setAddEditFormType("Add");
        setCurrentCompany({"CompanyType": '',
        "addressStreet": "",
        "addressTown": "",
        "name": "",
        "shortName": "",})
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { CompanyType, addressStreet, addressTown , name , shortName } = e.target.elements;

        if (name.value && CompanyType.value) {
            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewCompany(CompanyType.value, addressStreet.value, addressTown.value, name.value, shortName.value).then(() => {
                    alert(`${name.value} is successfully added.`)
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateCompany(currentCompanyId, CompanyType.value, addressStreet.value, addressTown.value, name.value, shortName.value).then(() => {
                    alert(`${name.value} is successfully updated.`);
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            }
        }
        setValidated(true)
    }

    const handleCompanyDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteCompany(currentCompanyId).then(() => {
            alert(`Deletion Successful`);
            handleModalClose();
            window.location.reload(false);
        }).catch((e) => {
            alert("Error occured: " + e.message);
            setIsLoading(false);
        })
    }

    return (
        <>
            {/* <h1>You're not logged in. Please <a href="/login">login</a> first then come to dashboard.</h1> */}
            {(user === null) && <NotLoggedInView />}
            {(isLoading === true) && <Spinner animation="border" variant="secondary" />}
            {(user !== null) && <>
                {/* Add/Edit Form START */}
                <Modal show={showAddEditForm} onHide={handleModalClose}>
                    <Form noValidate validated={validated} onSubmit={handleAddEditFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Add Company' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="name" label="Company Name" className="mb-3" >
                                <Form.Control required type='text' placeholder='Enter Company name' size='md' value={currentCompany?.name} onChange={(e) => {
                                    setCurrentCompany({     
                                        "CompanyType": currentCompany?.CompanyType,
                                        "addressStreet": currentCompany?.addressStreet,
                                        "addressTown": currentCompany?.addressTown,
                                        "name": (e.target.value) ? e.target.value : '',
                                        "shortName": currentCompany?.shortName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Company Name is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="CompanyType" label="Company Type" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Company Type' size='md' value={currentCompany?.CompanyType} onChange={(e) => {
                                    setCurrentCompany({
                                        "CompanyType": (e.target.value),
                                        "addressStreet": currentCompany?.addressStreet,
                                        "addressTown": currentCompany?.addressTown,
                                        "name": currentCompany?.name,
                                        "shortName": currentCompany?.shortName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Company Type is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="addressStreet" label="Address Street" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Address Street' size='md' value={currentCompany?.addressStreet} onChange={(e) => {
                                    setCurrentCompany({
                                        "CompanyType": currentCompany?.CompanyType,
                                        "addressStreet": (e.target.value),
                                        "addressTown": currentCompany?.addressTown,
                                        "name": currentCompany?.name,
                                        "shortName": currentCompany?.shortName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Address Street is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="addressTown" label="Address Town" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Address Town' size='md' value={currentCompany?.addressTown} onChange={(e) => {
                                    setCurrentCompany({
                                        "CompanyType": currentCompany?.CompanyType,
                                        "addressStreet": currentCompany?.addressStreet,
                                        "addressTown":  (e.target.value),
                                        "name": currentCompany?.name,
                                        "shortName": currentCompany?.shortName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Address Town is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="shortName" label="Short Name" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Short Name' size='md' value={currentCompany?.shortName} onChange={(e) => {
                                    setCurrentCompany({
                                        "CompanyType": currentCompany?.CompanyType,
                                        "addressStreet": currentCompany?.addressStreet,
                                        "addressTown": currentCompany?.addressTown,
                                        "name": currentCompany?.name,
                                        "shortName": (e.target.value)
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Short name required</Form.Control.Feedback>
                            </FloatingLabel>


                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit">{(addEditFormType === 'Add') ? 'Add' : 'Update'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Add/Edit Form END */}

                {/* Delete Confirmation Dialogue START */}
                <Modal show={showDeleteDialogue} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete {currentCompany.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {currentCompany.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleCompanyDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                        <Image src={`${imagee}`} style={{ width: '30%' }} />
                            <h4 style={{ marginTop: 8, }}>Company Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Add New Company</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Company Type</th>
                                    <th>Company Street Address</th>
                                    <th>Company Town Address</th>
                                    <th>Company Name</th>
                                    <th>Company Short Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Company) && (Company.map((Company, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{Company.doc.data.value.mapValue.fields.CompanyType.stringValue}</td>
                                        <td>{Company.doc.data.value.mapValue.fields.addressStreet.stringValue}</td>
                                        <td>{Company.doc.data.value.mapValue.fields.addressTown.stringValue}</td>
                                        <td>{Company.doc.data.value.mapValue.fields.name.stringValue}</td>
                                        <td>{Company.doc.data.value.mapValue.fields.shortName.stringValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentCompany(Company.doc.key.path.segments[Company.doc.key.path.segments.length - 1])
                                                setCurrentCompany({
                                                    "CompanyType": Company.doc.data.value.mapValue.fields.CompanyType.stringValue,
                                                    "addressStreet": Company.doc.data.value.mapValue.fields.addressStreet.stringValue,
                                                    "addressTown": Company.doc.data.value.mapValue.fields.addressTown.stringValue,
                                                    "name": Company.doc.data.value.mapValue.fields.name.stringValue,
                                                    "shortName": Company.doc.data.value.mapValue.fields.shortName.stringValue,
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Edit</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentCompanyId(Company.doc.key.path.segments[Company.doc.key.path.segments.length - 1]);
                                                setCurrentCompany({
                                                    "CompanyType": Company.doc.data.value.mapValue.fields.CompanyType.stringValue,
                                                    "addressStreet": Company.doc.data.value.mapValue.fields.addressStreet.stringValue,
                                                    "addressTown": Company.doc.data.value.mapValue.fields.addressTown.stringValue,
                                                    "name": Company.doc.data.value.mapValue.fields.name.stringValue,
                                                    "shortName": Company.doc.data.value.mapValue.fields.shortName.stringValue,
                                                });
                                                setShowDeleteDialogue(true);
                                            }}>x Delete</Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between align-items-center">
                        <p style={{ marginTop: 8, fontSize: 16, color: '#A1A1A1' }}>Delta Smart Technologies <a href="/login">Go back to home</a></p>
                    </Card.Footer>
                </Card>
            </>}
        </>
    );
}

export default Company;