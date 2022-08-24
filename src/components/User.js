import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';
import NotLoggedInView from './NoLoggedInView';
import FirestoreService from '../FirestoreService';
import imagee from "../images/image.jpg"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

function User(props) {

    const [user, setUser] = useState(null);
    const [Users, setUsers] = useState([]);
 

    const [isLoading, setIsLoading] = useState(false);

    const [currentUsers, setCurrentUsers] = useState({
        "name": '',
        "department": "",
        "email": "",
    });
    const [currentUsersId, setCurrentUsersId] = useState("");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    })

    function fetchUsers() {
        setIsLoading(true);
        FirestoreService.getAllUsers().then((response) => {
            setIsLoading(false);
            setUsers(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the user. " + e);
        })
    }

    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [addEditFormType, setAddEditFormType] = useState('Add'); //Add, Edit
    const [validated, setValidated] = useState(false);

    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setCurrentUsersId("");
        setAddEditFormType("Add");
        setCurrentUsers({"name": '',
        "department": "",
        "email": ""})
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { name,department,email } = e.target.elements;


            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewUsers(name.value,department.value,email.value).then(() => {
                    alert(`${name.value} is successfully added.`)
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateUsers(name.value,department.value,email.value).then(() => {
                    alert(`${name.value} is successfully updated.`);
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            }
        
        setValidated(true)
    }

    const handleUsersDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteUsers(currentUsersId).then(() => {
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
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Add User' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="name" label="Name" className="mb-3" >
                                <Form.Control required type='text' placeholder='Enter your name' size='md' value={currentUsers?.name} onChange={(e) => {
                                    setCurrentUsers({     
                                        "name": (e.target.value),
                                        "department": currentUsers?.addressStreet,
                                        "email": currentUsers?.addressTown,
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Name is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="Department" label="Department" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Department' size='md' value={currentUsers?.department} onChange={(e) => {
                                    setCurrentUsers({
                                        "name": currentUsers?.name,
                                        "department": (e.target.value),
                                        "email": currentUsers?.addressTown,
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Department is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="addressStreet" label="Email" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter email' size='md' value={currentUsers?.email} onChange={(e) => {
                                    setCurrentUsers({
                                        "name": currentUsers?.name,
                                        "department": currentUsers?.addressStreet,
                                        "email": (e.target.value),
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
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
                        <Modal.Title>Delete {currentUsers.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {currentUsers.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleUsersDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                        <Image src={`${imagee}`} style={{ width: '50%' }} />
                            <h4 style={{ marginTop: 8, }}>User Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Add New User</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Users) && (Users.map((Users, index) => (
                                    <tr key={index}>
                                        <td>{Users.doc.data.value.mapValue.fields.name.stringValue}</td>
                                        <td>{Users.doc.data.value.mapValue.fields.department.stringValue}</td>
                                        <td>{Users.doc.data.value.mapValue.fields.email.stringValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentUsers(Users.doc.key.path.segments[Users.doc.key.path.segments.length - 1])
                                                setCurrentUsers({
                                                    "name": Users.doc.data.value.mapValue.fields.name.stringValue,
                                                    "department": Users.doc.data.value.mapValue.fields.department.stringValue,
                                                    "email": Users.doc.data.value.mapValue.fields.email.stringValue,
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Edit</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentUsersId(Users.doc.key.path.segments[Users.doc.key.path.segments.length - 1]);
                                                setCurrentUsers({
                                                    "name": Users.doc.data.value.mapValue.fields.name.stringValue,
                                                    "department": Users.doc.data.value.mapValue.fields.department.stringValue,
                                                    "email": Users.doc.data.value.mapValue.fields.email.stringValue,
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

export default User;