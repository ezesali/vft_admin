import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../../App.css";

import TabPanel from "../../components/TabPanel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LoadingSpinner from '../../components/Loading';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import * as GrIcons from 'react-icons/gr';
import TextField from '@mui/material/TextField';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from "draftjs-to-html";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { serverTimestamp } from "firebase/firestore";




export function ManageContent() {

  const [value, setValue] = useState(0);
  const [navisOpen, setNavisOpen] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const [aboutUsID, setAboutUsID] = useState(null)
  const [aboutUs, setAboutUs] = useState('')
  const [editorStateAboutUs, setEditorStateAboutUs] = useState(null)
  const [contentAboutUs, setContentAboutUs] = useState('')

  const [termCondID, setTermCondID ] = useState(null)
  const [TermCond, setTermCond] = useState('')
  const [editorStateTermCond, setEditorStateTermCond] = useState(null)
  const [contentTermCond, setContentTermCond] = useState('')

  const [privPolID, setPrivPolID] = useState(null)
  const [PrivPol, setPrivPol] = useState('')
  const [editorStatePrivPol, setEditorStatePrivPol] = useState(null)
  const [contentPrivPol, setContentPrivPol] = useState('')

  const [legalTermsID, setLegalTermsID] = useState(null)
  const [legalTerms, setLegalTerms] = useState('')
  const [editorStateLegalTerms, setEditorStateLegalTerms] = useState(null)
  const [contentLegalTerms, setContentLegalTerms] = useState('')


  const [shareMsgID, setShareMsgID] = useState(null)
  const [shareMsgContent, setShareMsgContent] = useState('')
  const [shareMsg, setShareMsg] = useState('')
  
  const [androidAppURLID, setAndroidAppURLID] = useState(null)
  const [androidAppURLContent, setAndroidAppURLContent] = useState('')
  const [androidAppURL, setAndroidAppURL] = useState('')
  
  const [iosAppURLID, setIosAppURLID] = useState(null)
  const [iosAppURLContent, setIosAppURLContent] = useState('')
  const [iosAppURL, setIosAppURL] = useState('')
  
  const [websiteURLID, setWebsiteURLID] = useState(null)
  const [websiteURLContent, setWebsiteURLContent] = useState('')
  const [websiteURL, setWebsiteURL] = useState('')


  const docRef = query(collection(db, "content_master"), where("delete_flag", "==", 0));

useEffect(() => {

    async function getContentData() {

        setLoading(true)

        const querySnapshot = await getDocs(docRef);

        querySnapshot.forEach((doc) => {

            switch (doc.data().content_type) {
                case 0:
                    const contentBlockAboutUs = htmlToDraft(doc.data().content_1);
                    if (contentBlockAboutUs) {
                        const contentState = ContentState.createFromBlockArray(contentBlockAboutUs.contentBlocks);
                        setEditorStateAboutUs(EditorState.createWithContent(contentState))
                    }
                    
                    setAboutUs(doc.data().content_1)
                    setContentAboutUs(doc.data().content_1)
                    setAboutUsID(doc.id)
                    
                    break;

                case 1:

                    const contentBlockPrivPol = htmlToDraft(doc.data().content_1);
                    if (contentBlockPrivPol) {
                        const contentState = ContentState.createFromBlockArray(contentBlockPrivPol.contentBlocks);
                        setEditorStatePrivPol(EditorState.createWithContent(contentState))
                    }

                    setPrivPol(doc.data().content_1)
                    setContentPrivPol(doc.data().content_1)
                    setPrivPolID(doc.id)

                    break;

                case 2:
                    const contentBlockTermCond = htmlToDraft(doc.data().content_1);
                    if (contentBlockTermCond) {
                        const contentState = ContentState.createFromBlockArray(contentBlockTermCond.contentBlocks);
                        setEditorStateTermCond(EditorState.createWithContent(contentState))
                    }

                    setTermCond(doc.data().content_1)
                    setContentTermCond(doc.data().content_1)
                    setTermCondID(doc.id)

                    break;

                case 6:

                    const contentBlockLegalTerms = htmlToDraft(doc.data().content_1);
                    if (contentBlockLegalTerms) {
                        const contentState = ContentState.createFromBlockArray(contentBlockLegalTerms.contentBlocks);
                        setEditorStateLegalTerms(EditorState.createWithContent(contentState))
                    }

                    setLegalTerms(doc.data().content_1)
                    setContentLegalTerms(doc.data().content_1)
                    setLegalTermsID(doc.id)

                    break;

                case 3:

                    setIosAppURLID(doc.id)
                    setIosAppURLContent(doc.data().content_1)
                    setIosAppURL(doc.data().content_1)

                    break;

                case 4:

                    setAndroidAppURLID(doc.id)
                    setAndroidAppURLContent(doc.data().content_1)
                    setAndroidAppURL(doc.data().content_1)

                    break;

                case 5:

                    setShareMsgID(doc.id)
                    setShareMsgContent(doc.data().content_1)
                    setShareMsg(doc.data().content_1)

                    break;

                case 7:

                    setWebsiteURLID(doc.id)
                    setWebsiteURLContent(doc.data().content_1)
                    setWebsiteURL(doc.data().content_1)

                    break;

                default:
                    break;
            }

            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });

        setLoading(false)
    };

    getContentData();



}, [])


const handleChange = (event, newValue) => {
setValue(newValue);
};


const updateAboutUs = async() => {

    var docAboutUsRef = doc(db, "content_master",''+aboutUsID+'');

    const docSnapAboutUs = await getDoc(docAboutUsRef);

    if (docSnapAboutUs.exists()) {
        
        //console.log("Document data:", docSnapAboutUs.data());

        setLoadingUpdate(true)

        await updateDoc(docAboutUsRef, {
            content_1: contentAboutUs,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setAboutUs(contentAboutUs)
            setMessageAlert('About us update successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateTermCond = async() => {

    var docTermCondRef = doc(db, "content_master",''+termCondID+'');

    const docSnapTermCond = await getDoc(docTermCondRef);

    if (docSnapTermCond.exists()) {
        
        //console.log("Document data:", docSnapTermCond.data());

        setLoadingUpdate(true)

        await updateDoc(docTermCondRef, {
            content_1: contentTermCond,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setTermCond(contentTermCond)
            setMessageAlert('Terms & Conditions updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updatePrivPol = async() => {

    var docPrivPolRef = doc(db, "content_master",''+privPolID+'');

    const docSnapPrivPol = await getDoc(docPrivPolRef);

    if (docSnapPrivPol.exists()) {
        
        //console.log("Document data:", docSnapPrivPol.data());

        setLoadingUpdate(true)

        await updateDoc(docPrivPolRef, {
            content_1: contentPrivPol,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setPrivPol(contentPrivPol)
            setMessageAlert('Privacy Policy updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateLegalTerms = async() => {

    var docLegalTermsRef = doc(db, "content_master",''+legalTermsID+'');

    const docSnapLegalTerms = await getDoc(docLegalTermsRef);

    if (docSnapLegalTerms.exists()) {
        
        //console.log("Document data:", docSnapLegalTerms.data());

        setLoadingUpdate(true)

        await updateDoc(docLegalTermsRef, {
            content_1: contentLegalTerms,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setLegalTerms(contentLegalTerms)
            setMessageAlert('Legal Terms updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateShareMsg = async() => {

    var docShareMsgRef = doc(db, "content_master",''+shareMsgID+'');

    const docSnapShareMsg = await getDoc(docShareMsgRef);

    if (docSnapShareMsg.exists()) {
        
        //console.log("Document data:", docSnapShareMsg.data());

        setLoadingUpdate(true)

        await updateDoc(docShareMsgRef, {
            content_1: shareMsgContent,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setShareMsg(shareMsgContent)
            setMessageAlert('Share message updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateAndroidURL = async() => {

    var docAndroidURLRef = doc(db, "content_master",''+androidAppURLID+'');

    const docSnapAndroidURL = await getDoc(docAndroidURLRef);

    if (docSnapAndroidURL.exists()) {
        
        //console.log("Document data:", docSnapAndroidURL.data());

        setLoadingUpdate(true)

        await updateDoc(docAndroidURLRef, {
            content_1: androidAppURLContent,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setAndroidAppURL(androidAppURLContent)
            setMessageAlert('Android App URL updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateIosURL = async() => {

    var docIosURLRef = doc(db, "content_master",''+iosAppURLID+'');

    const docSnapIosURL = await getDoc(docIosURLRef);

    if (docSnapIosURL.exists()) {
        
        //console.log("Document data:", docSnapIosURL.data());

        setLoadingUpdate(true)

        await updateDoc(docIosURLRef, {
            content_1: iosAppURLContent,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setIosAppURL(iosAppURLContent)
            setMessageAlert('iOS App URL updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}

const updateWebSite = async() => {

    var docWebSiteURLRef = doc(db, "content_master",''+websiteURLID+'');

    const docSnapWebSiteURL = await getDoc(docWebSiteURLRef);

    if (docSnapWebSiteURL.exists()) {
        
        //console.log("Document data:", docSnapWebSiteURL.data());

        setLoadingUpdate(true)

        await updateDoc(docWebSiteURLRef, {
            content_1: websiteURLContent,
            updatetime  : serverTimestamp()
        }).then(() =>{

            setWebsiteURL(websiteURLContent)
            setMessageAlert('WebSite URL updated successfully')
            setOpenAlert(true)

        });

        setLoadingUpdate(false)

    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }

}
  


  return (
    
    <>
        {loading && <LoadingSpinner/>}
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '180px' : null}} className="dashboardContainerProfile">
            <div className="page-header">
                <div className="row-profile">
                    <div className="profileHead">
                        <div className="title">
                            <h4>Manage Content</h4>
                        </div>
                        <nav aria-label="breadcrumb" role="navigation">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                <Link to="/" className="Linkp">
                                    Dashboard
                                </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Manage Content</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpenAlert(false);
                        setMessageAlert('')
                    }}
                    >
                    <GrIcons.GrClose color="#000"/>
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                {messageAlert}
                </Alert>
            </Collapse>
            <div className="profileData">

                <Tabs variant="scrollable" scrollButtons={false} visibleScrollbar className="tabsProfile" value={value} onChange={handleChange}>
                    <Tab style={{color: '#181f48', }} label="About Us"  />
                    <Tab style={{color: '#181f48', }} label="Terms & Conditions"  />
                    <Tab style={{color: '#181f48', }} label="Privacy Policy"  />
                    <Tab style={{color: '#181f48', }} label="Legal Terms"  />
                    <Tab style={{color: '#181f48', }} label="Share Message"  />
                    <Tab style={{color: '#181f48', }} label="Android App URL"  />
                    <Tab style={{color: '#181f48', }} label="IOS App URL"  />
                    <Tab style={{color: '#181f48', }} label="Website URL"  />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <Editor
                    editorState={editorStateAboutUs}
                    spellCheck
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={(contentEditor) => contentAboutUs !== draftToHtml(contentEditor) && setContentAboutUs(draftToHtml(contentEditor))}
                    onEditorStateChange={(editor) => setEditorStateAboutUs(editor) }
                    />
                    <button style={{backgroundColor: aboutUs === contentAboutUs ? 'grey' : 'black', cursor: aboutUs === contentAboutUs ? 'not-allowed' : 'pointer'}} 
                    disabled={aboutUs === contentAboutUs} onClick={updateAboutUs} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>

                </TabPanel>
                <TabPanel value={value} index={1}>

                    <Editor
                    editorState={editorStateTermCond}
                    spellCheck
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={(contentEditor) => contentTermCond !== draftToHtml(contentEditor) && setContentTermCond(draftToHtml(contentEditor))}
                    onEditorStateChange={(editor) => setEditorStateTermCond(editor) }
                    />
                    <button style={{backgroundColor: TermCond === contentTermCond ? 'grey' : 'black', cursor: TermCond === contentTermCond ? 'not-allowed' : 'pointer'}} 
                    disabled={TermCond === contentTermCond} onClick={updateTermCond} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                    
                </TabPanel>
                <TabPanel value={value} index={2}>

                    <Editor
                    editorState={editorStatePrivPol}
                    spellCheck
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={(contentEditor) => contentPrivPol !== draftToHtml(contentEditor) && setContentPrivPol(draftToHtml(contentEditor))}
                    onEditorStateChange={(editor) => setEditorStatePrivPol(editor) }
                    />
                    <button style={{backgroundColor: PrivPol === contentPrivPol ? 'grey' : 'black', cursor: PrivPol === contentPrivPol ? 'not-allowed' : 'pointer'}} 
                    disabled={PrivPol === contentPrivPol} onClick={updatePrivPol} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                                
                </TabPanel>

                <TabPanel value={value} index={3}>

                    <Editor
                    editorState={editorStateLegalTerms}
                    spellCheck
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={(contentEditor) => contentLegalTerms !== draftToHtml(contentEditor) && setContentLegalTerms(draftToHtml(contentEditor))}
                    onEditorStateChange={(editor) => setEditorStateLegalTerms(editor) }
                    />
                    <button style={{backgroundColor: legalTerms === contentLegalTerms ? 'grey' : 'black', cursor: legalTerms === contentLegalTerms ? 'not-allowed' : 'pointer'}} 
                    disabled={legalTerms === contentLegalTerms} onClick={updateLegalTerms} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                                
                </TabPanel>

                <TabPanel value={value} index={4}>
                <div className="divContainerTabs">
                    <label>Message<br/></label>
                    <TextField onChange={(event) => setShareMsgContent(event.target.value)} value={shareMsgContent} minRows={6} multiline id="outlined-basic" variant="outlined" />
                    <button onClick={updateShareMsg} style={{backgroundColor: shareMsg === shareMsgContent ? 'grey' : 'black', cursor: shareMsg === shareMsgContent ? 'not-allowed' : 'pointer', marginLeft: 0}} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                </div>

                </TabPanel>
                <TabPanel value={value} index={5}>

                <div className="divContainerTabs">
                    <label>Android App URL<br/></label>
                    <TextField onChange={(event) => setAndroidAppURLContent(event.target.value)} value={androidAppURLContent}  id="outlined-basic" variant="outlined" />
                    <button onClick={updateAndroidURL} style={{backgroundColor: androidAppURL === androidAppURLContent ? 'grey' : 'black', cursor: androidAppURL === androidAppURLContent ? 'not-allowed' : 'pointer', marginLeft: 0}} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                </div>
                    
                </TabPanel>
                <TabPanel value={value} index={6}>

                <div className="divContainerTabs">
                    <label>iOS App URL<br/></label>
                    <TextField onChange={(event) => setIosAppURLContent(event.target.value)} value={iosAppURLContent}  id="outlined-basic" variant="outlined" />
                    <button onClick={updateIosURL} style={{backgroundColor: iosAppURL === iosAppURLContent ? 'grey' : 'black', cursor: iosAppURL === iosAppURLContent ? 'not-allowed' : 'pointer', marginLeft: 0}} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                </div>

                </TabPanel>
                <TabPanel value={value} index={7}>

                <div className="divContainerTabs">
                    <label>Website URL<br/></label>
                    <TextField onChange={(event) => setWebsiteURLContent(event.target.value)} value={websiteURLContent}  id="outlined-basic" variant="outlined" />
                    <button onClick={updateWebSite} style={{backgroundColor: websiteURL === websiteURLContent ? 'grey' : 'black', cursor: websiteURL === websiteURLContent ? 'not-allowed' : 'pointer', marginLeft: 0}} className="btnUpdateManageContent" type="submit">{loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}</button>
                </div>
                    
                </TabPanel>
            </div>
        </div>
    </>
  );
}