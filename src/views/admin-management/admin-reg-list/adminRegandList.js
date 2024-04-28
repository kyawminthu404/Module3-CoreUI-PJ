import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CImg,
  CInput,
  CRow,
  CSelect,
  CInputGroup, CInputGroupPrepend, CInputGroupText, 
} from '@coreui/react'
import { useHistory } from 'react-router'
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError";
import { ApiRequest } from "../../common/ApiRequest"; // <--first step 
import NPagination from '../../common/pagination/NPagination';
import { nullChk, numberChk, validateName } from '../../common/CommonValidation';
import Confirmation from "../../common/Confirmation";
import CIcon from '@coreui/icons-react';

const AdminRegAndListIndex = () => {
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState([])
  const [totalRow, setTotalRow] = useState(""); // for user list table rows
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [updateID, setUpdateID] = useState("");
  const [loading, setLoading] = useState(false); // For Loading
  const [updateStatus, setUpdateStatus] = useState(false); //for update status
  const [error, setError] = useState([]); // for error message
  const [success, setSuccess] = useState([]); // for success message
  const [total, setTotal] = useState(""); // total rows
  const [confirmationModel, setConfirmationModel] = useState(false);
  const [content, setContent] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const [deleteId, setDeleteId] = useState("");


  useEffect(() => {
    let flag = localStorage.getItem(`LoginProcess`)
    if (flag == "true") {
      console.log("Login process success")
    } else {
      history.push(`/Login`);
    }

    (async () => {
      setLoading(true);
      await search(); // table data twy pya moh
      setLoading(false);
    })();

  }, []);


  const search = async (page = 1) => { 

    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
    };
    let response = await ApiRequest(search); // output data from backend database
    if (response.flag === false) {
      setAdmin([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") { //OK and NG
        setAdmin(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);

      } else {
        setError([response.data.message]);
        setAdmin([]); //empty data
      }
    }

  }


  const userNameChange = (e) => {
    setUserName(e.target.value);
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
  }

  const reset = () => {
    setUserName("");
    setPassword("");
  }

  const saveClick =  () => {
    setConfirmationModel(true);
    setContent("Are you sure wanna save?");
    setConfirmType("save");
}

  const saveOK = async () => {
    let errormsg = [];
    setLoading(true);
    setConfirmationModel(false);
    if(!nullChk(userName)) {
      errormsg.push("Please fill your name");
    }else if (!validateName(userName)) {
      errormsg.push("Please fill only string Value");
    }
    if(!nullChk(password)) {
      errormsg.push("Please fill your password");
    }else if (!numberChk(password)) {
      errormsg.push("Please fill inter Value");
    }
    if(errormsg.length > 0) {
      setSuccess([]);
      setError(errormsg);
      setLoading(false);
    }else {
    setLoading(true);
    setError([]);
    setUpdateStatus(false);
    let saveData = {
      method: "post",
      url: `admin/save`,
      params: {
        name: userName,
        password: password,
      },
    };
    let response = await ApiRequest(saveData);
    //console.log(response.flag);
    if (response.flag === false) {
      //setError(["Please fill ur valid name & password"])
      setError(response.message);
      setSuccess([]);
      
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); 
        setSuccess([response.data.message]);
        reset();
        search();
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
  }
  }


  const editClick = async (id) => {
    setLoading(true);
    setUpdateStatus(true);
    setUpdateID(id);
    let saveData = {
      method: "get",
      url: `admin/edit/${id}`,
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setUserName(response.data.data.name);
        setPassword(response.data.data.password);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
  }




  
  const delClick = async (id) => {
    setConfirmationModel(true);
    setContent("Are you sure wanna Delete?"); 
    setConfirmType("delete");
    setDeleteId(id);
  
    
  }

  const deleteOK = async () => {
    setConfirmationModel(false);
    setLoading(true);
    let saveData = {
      method: "delete",
      url: `admin/delete/${deleteId}`,
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        let page = currentPage;
        setSuccess([response.data.message]);   
        if(admin.length - 1 == 0) {
          page = currentPage -1;
        }
        search(page);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
    
  }
  


const updateClick = async () => {
    setConfirmationModel(true);
    setContent("Are you sure wanna Update?"); 
    setConfirmType("update");
}



  const updateOK = async () => {
  setConfirmationModel(false);
  setLoading(true);
  let error = [];
  if(!nullChk(userName)) {
    error.push("Please fill your username");
  }else if (!validateName(userName)) {
    error.push("Please fill character only");
  }
  if(!nullChk(password)) {
    error.push("Please fill your password");
  }else if(!numberChk(password)) {
    error.push("Please fill integer value only");
  }
  if(error.length > 0) {
    setSuccess([]);
    setError(error);
    setLoading(false);
  }else {
    setLoading(true);
    setUpdateStatus(false);
    let saveData = {
      method: "post",
      url: `admin/update/${updateID}`,
      params: {
        name: userName,
        password: password,
      },
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") { 
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setSuccess([response.data.message]);
        reset();
        search();
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
  }
  }

  const pagination = (i) => {
    setCurrentPage(i);
    search(i);
  }
  return (
    <>
      <CRow>
        <CCol xs="12">
          <SuccessError success={success} error={error} />
          <CCard>
            <CCardHeader>
              <h4 className='m-0' style={{color: "#164930"}}>-Admin Registeration</h4>
            </CCardHeader>
            <CCardBody>

              <CRow style={{ marginTop: "10px" }}>
                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2' style={{fontWeight: 800}}>UserName</p>
                    </CCol>
                    <CCol lg="7">
                    <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name='cil-User'/>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type='text' value={userName} onChange={userNameChange} required/>
                    </CInputGroup>
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>


                </CCol>


                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2' style={{ fontWeight: 800}}>Password</p>
                    </CCol>
                    <CCol lg="7">
                    <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name='cil-Lock-Locked'/>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type='password' value={password} onChange={passwordChange} required/>
                    </CInputGroup>
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>

                </CCol>

              </CRow>
              <CRow style={{ justifyContent: "center" }} className="mt-4">
              {updateStatus == false && (
                  <CButton className="form-btn" onClick={saveClick} style={{fontFamily:"cursive"  }}>
                    Save
                  </CButton>
                )}
              {
                  updateStatus == true && (
                    <CButton className="form-btn" onClick={updateClick} style={{fontFamily:"cursive"  }}>
                      Update
                    </CButton>
                  )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <CRow className="mt-3">
        <CCol xs="12">
          <CCard>
            <CCardHeader >
              <h4 className='m-0' style={{ color: "#164930"}}>-Admin List</h4>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  {admin.length > 0 && (
                    <>
                      <p className='mb-1 font-weight-bold' style={{textAlign: "right", color: "#164930"}}>-Total: {total} row(s)</p>
                      <div className='overflow'>
                        <table className='table table-striped table-hover'>
                          <thead>
                            <tr>
                              <th className="text-center" width={50} style={{color: "#164930"}}  >No</th>
                              <th className='text-center' width={120} style={{color: "#164930"}} >UserName</th>
                              <th className='text-center' width={120} style={{color: "#164930"}} >UserCode</th>
                              <th className='text-center' width={120} style={{color: "#164930"}}>Password</th>
                              <th className='text-center' width={100} colSpan={2} style={{color: "#164930"}}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admin.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td width={50} className="text-center">{index + 1}</td>
                                  <td className="text-center" width={120} >{data.name}</td>
                                  <td className="text-center" width={120} >{data.user_code}</td>
                                  <td className="text-center" width={120} > {data.password}</td>
                                  <td style={{textAlign:"center" ,width:"35px"}}>
                                  <div className="user-before">
                                    <CImg src="/image/Edit-Component-inactive.svg" onClick={() => {editClick(data.id); 
                                    }} style={{width: "40px", height:" 40px", cursor:"pointer"}}>
                                    </CImg>
                                    <CImg className="user-after" src="/image/Edit-Component-active.svg" onClick={() => {editClick(data.id);}}
                                    style={{width: "40px", height: "40px", cursor: "pointer"}}>
                                    </CImg>
                                  </div>
                              
                            </td>

                            <td style={{ textAlign:"center", width:"35px"}}>
                              <div className="user-before">
                                <CImg src="/image/Delete-Component-inactive.svg" onClick={() => {delClick(data.id);}} 
                                style={{width: "40px", height: "40px", cursor: "pointer"}}>
                                </CImg>
                                <CImg className="user-after" src="/image/Delete-Component-active.svg" onClick={() => {delClick(data.id);}}
                                style={{width: "40px", height: "40px", cursor: "pointer"}}>
                                </CImg>
                              </div>
                            </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Confirmation
            show={confirmationModel}
            content={content}
            type={confirmType}
            saveOK={saveOK}
            deleteOK={deleteOK}
            updateOK={updateOK}
            cancel={() => setConfirmationModel(false)}
            cancelButton="No"
            okButton="Yes"
        />

                            <br></br>
        {total > 10 &&
        <NPagination
          activePage={currentPage}
          pages={lastPage}
          currentPage={currentPage}
          totalPage={lastPage}
          pagination={pagination}
        />
      }
      
    </>
  )
}

export default AdminRegAndListIndex