import "./CreateThread.css";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../communities/Home";
import { TextEditor } from "../../general/textinput/TextEditor";

export const CreateThread = () =>
{
    const authContext = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [community, setCommunity] = useState<string | null>(null);
    const [link, setLink] = useState<string | null>(null);
    const [bodyHTML, setBodyHTML] = useState<string | null>(null);
    
    return <div className="createThreadForm">
        <div className="createThreadFormTitle">Create a Thread</div>
        <ErrorMessage error={errorMessage} />
        <CommunityEditor setTextField={setCommunity}/>
        <TitleEditor setTextField={setTitle}/>
        <LinkEditor setTextField={setLink}/>
        <BodyEditor setTextField={setBodyHTML} />
        <button onClick={() => tryCreateThread(title, community, link, bodyHTML, setErrorMessage, authContext.token)} className="button" type="submit">Create Thread</button>
    </div>

}

interface IThreadTextField {
    setTextField: Dispatch<SetStateAction<string | null>>,
}

const CommunityEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Community</span> 
        <div className="communityInputContainer"><input name="community" className="communityInputField" onChange={(e) => props.setTextField(e.target.value)}></input></div>
    </div>
}

const TitleEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Title</span>
        <div className="inputContainer"><input name="title" className="inputField" onChange={(e) => props.setTextField(e.target.value)}></input></div>
    </div>
}

const LinkEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Link</span> <span className="inputTitleOptional">(optional)</span>
        <div className="inputContainer"><input name="link" className="inputField" onChange={(e) => props.setTextField(e.target.value)}></input></div>
    </div>
}

const BodyEditor = (props: IThreadTextField) =>
{
    return <div className="bodyEditorContainer">
        <span className="bodyInputTitle">Body</span> <span className="inputTitleOptional">(optional)</span>
        <TextEditor setTextField={props.setTextField}/>
    </div>
}

interface IErrorMessageProps
{
    error: string | null;
}

const ErrorMessage = (props: IErrorMessageProps) =>
{
    if (props.error == null)
        return null;
    else {
        return <span className="createThreadErrorString">{props.error}</span>
    }
}

async function tryCreateThread(title: string | null, community: string | null, link: string | null, bodyHTML: string | null, setErrorMessage: Dispatch<SetStateAction<string | null>>, token: string | null)
{
    if (title == null) 
    {
        setErrorMessage("A title is required.");
        return;
    }

    if (community == null)
    {
        setErrorMessage("A community is required.")
        return;
    }

    try {
        await axios.post('http://localhost:5000/api/createthread', {community, title, link, bodyHTML, token});
    } catch (err: any) {
        console.log(err);
    }
}