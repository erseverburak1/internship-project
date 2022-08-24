import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';
import NotLoggedInView from './NoLoggedInView';
import FirestoreService from '../FirestoreService';
import imagee from "../images/image.jpg"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

function Town(props) {

    const [user, setUser] = useState(null);
    const [Town, setTown] = useState([]);
    const [TownName, setTownName] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentTown, setCurrentTown] = useState({
        "townName": '',
        "region": "",
        "city": "",
    });
    const [currentTownId, setCurrentTownId] = useState("");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    })



    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [addEditFormType, setAddEditFormType] = useState('Add'); //Add, Edit
    const [validated, setValidated] = useState(false);

    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setCurrentTownId("");
        setAddEditFormType("Add");
        setCurrentTown({"townName": '',
        "region": "",
        "city": "",})
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { townName, region, city} = e.target.elements;

        if (townName.value) {
            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewTown(townName.value, region.value, city.value).then(() => {
                    alert(`${townName.value} is successfully added to the menu.`)
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateTown(currentTownId, townName.value, region.value, city.value).then(() => {
                    alert(`${townName.value} is successfully updated.`);
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

    const handleTownDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteTown(currentTownId).then(() => {
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
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Add Town' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="townName" label="Town Name" className="mb-3" >
                                <Form.Control required type='text' placeholder='Enter Town name' size='md' value={currentTown?.townName} onChange={(e) => {
                                    setCurrentTown({
                                        "townName": (e.target.value) ? e.target.value : '',     
                                        "region": currentTown?.region,
                                        "city": currentTown?.city,
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Town Name is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="region" label="Region" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Region' size='md' value={currentTown?.region} onChange={(e) => {
                                    setCurrentTown({
                                        "townName": currentTown?.townName,    
                                        "region": (e.target.value) ? e.target.value : '',
                                        "city": currentTown?.city,
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Region is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="city" label="City" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter City' size='md' value={currentTown?.city} onChange={(e) => {
                                    setCurrentTown({
                                        "townName": currentTown?.townName,      
                                        "region": currentTown?.region,
                                        "city": (e.target.value) ? e.target.value : '',
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>City is required</Form.Control.Feedback>
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
                        <Modal.Title>Delete {currentTown.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {currentTown.townName}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleTownDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                        <Image src={`${imagee}`} style={{ width: '50%' }} />
                            <h4 style={{ marginTop: 8, }}>Town Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Add New Town</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Town Name</th>
                                    <th>Region</th>
                                    <th>City</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Town) && (Town.map((Town, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{Town.doc.data.value.mapValue.fields.townName.stringValue}</td>
                                        <td>{Town.doc.data.value.mapValue.fields.region.stringValue}</td>
                                        <td>{Town.doc.data.value.mapValue.fields.city.stringValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentTown(Town.doc.key.path.segments[Town.doc.key.path.segments.length - 1])
                                                setCurrentTown({
                                                    "townName": Town.doc.data.value.mapValue.fields.townName.stringValue,
                                                    "region": Town.doc.data.value.mapValue.fields.region.stringValue,
                                                    "city": Town.doc.data.value.mapValue.fields.city.stringValue,
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Edit</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentTownId(Town.doc.key.path.segments[Town.doc.key.path.segments.length - 1]);
                                                setCurrentTown({
                                                    "townName": Town.doc.data.value.mapValue.fields.townName.stringValue,
                                                    "region": Town.doc.data.value.mapValue.fields.region.stringValue,
                                                    "city": Town.doc.data.value.mapValue.fields.city.stringValue,
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

export default Town;