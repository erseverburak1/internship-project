import React, { useState } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';
import NotLoggedInView from './NoLoggedInView';
import FirestoreService from '../services/firestoreService';
import imagee from "../images/image.jpg"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

function Department(props) {

    const [user, setUser] = useState(null);
    const [Department, setDepartment] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentDepartment, setCurrentDepartment] = useState({
        "Departmentype": '',
        "addressStreet": "",
        "addressTown": "",
        "companyName": "",
        "departmentName": "",
    });
    const [currentDepartmentId, setCurrentDepartmentId] = useState("");

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
        setCurrentDepartmentId("");
        setAddEditFormType("Add");
        setCurrentDepartment({"Departmentype": '',
        "addressStreet": "",
        "addressTown": "",
        "companyName": "",
        "departmentName": "",})
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { DepartmentType, addressStreet, addressTown , companyName , departmentName } = e.target.elements;

        if (true) {
            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewDepartment(DepartmentType.value, addressStreet.value, addressTown.value, companyName.value, departmentName.value).then(() => {
                    alert(`${departmentName.value} is successfully added.`)
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateDepartment(currentDepartmentId, DepartmentType.value, addressStreet.value, addressTown.value, companyName.value, departmentName.value).then(() => {
                    alert(`${departmentName.value.value} is successfully updated.`);
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

    const handleDepartmentDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteDepartment(currentDepartmentId).then(() => {
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
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Add Department' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="name" label="Department Name" className="mb-3" >
                                <Form.Control required type='text' placeholder='Enter Department name' size='md' value={currentDepartment?.departmentName} onChange={(e) => {
                                    setCurrentDepartment({     
                                        "DepartmentType": currentDepartment?.DepartmentType,
                                        "addressStreet": currentDepartment?.addressStreet,
                                        "addressTown": currentDepartment?.addressTown,
                                        "companyName": currentDepartment?.companyName,
                                        "departmentName": (e.target.value) ? e.target.value : ''
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Department Name is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="DepartmentType" label="Department Type" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Department Type' size='md' value={currentDepartment?.DepartmentType} onChange={(e) => {
                                    setCurrentDepartment({
                                        "DepartmentType": (e.target.value),
                                        "addressStreet": currentDepartment?.addressStreet,
                                        "addressTown": currentDepartment?.addressTown,
                                        "companyName": currentDepartment?.companyName,
                                        "departmentName": currentDepartment?.departmentName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Department Type is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="addressStreet" label="Address Street" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Address Street' size='md' value={currentDepartment?.addressStreet} onChange={(e) => {
                                    setCurrentDepartment({
                                        "DepartmentType": currentDepartment?.Departmentype,
                                        "addressStreet": (e.target.value),
                                        "addressTown": currentDepartment?.addressTown,
                                        "companyName": currentDepartment?.companyName,
                                        "departmentName": currentDepartment?.departmentName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Address Street is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="addressTown" label="Address Town" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Address Town' size='md' value={currentDepartment?.addressTown} onChange={(e) => {
                                    setCurrentDepartment({
                                        "DepartmentType": currentDepartment?.Departmentype,
                                        "addressStreet": currentDepartment?.addressStreet,
                                        "addressTown": (e.target.value),
                                        "companyName": currentDepartment?.companyName,
                                        "departmentName": currentDepartment?.departmentName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Address Town is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="companyName" label="Company Name" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter Company Name' size='md' value={currentDepartment?.companyName} onChange={(e) => {
                                    setCurrentDepartment({
                                        "DepartmentType": currentDepartment?.Departmentype,
                                        "addressStreet": currentDepartment?.addressStreet,
                                        "addressTown": currentDepartment?.addressTown,
                                        "companyName": (e.target.value),
                                        "departmentName": currentDepartment?.departmentName
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Company name required</Form.Control.Feedback>
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
                        <Modal.Title>Delete {currentDepartment.departmentName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {currentDepartment.departmentName}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleDepartmentDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                        <Image src={`${imagee}`} style={{ width: '50%' }} />
                            <h4 style={{ marginTop: 8, }}>Department Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Add New Department</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Department Type</th>
                                    <th>Department Street Address</th>
                                    <th>Department Town Address</th>
                                    <th>Company Name</th>
                                    <th>Department Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Department) && (Department.map((Department, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{Department.doc.data.value.mapValue.fields.DepartmentType.stringValue}</td>
                                        <td>{Department.doc.data.value.mapValue.fields.addressStreet.stringValue}</td>
                                        <td>{Department.doc.data.value.mapValue.fields.addressTown.stringValue}</td>
                                        <td>{Department.doc.data.value.mapValue.fields.companyName.stringValue}</td>
                                        <td>{Department.doc.data.value.mapValue.fields.departmentName.stringValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentDepartment(Department.doc.key.path.segments[Department.doc.key.path.segments.length - 1])
                                                setCurrentDepartment({
                                                    "DepartmentType": Department.doc.data.value.mapValue.fields.DepartmentType.stringValue,
                                                    "addressStreet": Department.doc.data.value.mapValue.fields.addressStreet.stringValue,
                                                    "addressTown": Department.doc.data.value.mapValue.fields.addressTown.stringValue,
                                                    "companyName": Department.doc.data.value.mapValue.fields.companyName.stringValue,
                                                    "departmentName": Department.doc.data.value.mapValue.fields.departmentName.stringValue,
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Edit</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentDepartmentId(Department.doc.key.path.segments[Department.doc.key.path.segments.length - 1]);
                                                setCurrentDepartment({
                                                    "DepartmentType": Department.doc.data.value.mapValue.fields.DepartmentType.stringValue,
                                                    "addressStreet": Department.doc.data.value.mapValue.fields.addressStreet.stringValue,
                                                    "addressTown": Department.doc.data.value.mapValue.fields.addressTown.stringValue,
                                                    "companyName": Department.doc.data.value.mapValue.fields.companyName.stringValue,
                                                    "departmentName": Department.doc.data.value.mapValue.fields.departmentName.stringValue,
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

export default Department;