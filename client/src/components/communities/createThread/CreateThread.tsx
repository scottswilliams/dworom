import "./CreateThread.css";
import { Dispatch, FormEvent, SetStateAction, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Home";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextEditor } from "../textinput/TextEditor";

export const CreateThread = () =>
{
    const authContext = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<String | null>(null);
    const [community, setCommunity] = useState<String | null>(null);
    const [link, setLink] = useState<String | null>(null);
    const [bodyHTML, setBodyHTML] = useState<String | null>(null);
    
    return <div className="createThreadForm">
        <div className="createThreadFormTitle">Create a Thread</div>
        <ErrorMessage error={errorMessage} />
        <CommunityEditor setTextField={setCommunity}/>
        <TitleEditor setTextField={setTitle}/>
        <LinkEditor setTextField={setLink}/>
        <BodyEditor setTextField={setBodyHTML} />
        <button onClick={() => tryCreateThread(title, community, link, bodyHTML, setErrorMessage, authContext.token)} className="createThreadButton" type="submit">Create Thread</button>
    </div>

}

interface IThreadTextField {
    setTextField: Dispatch<SetStateAction<String | null>>,
}

const CommunityEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Community</span> 
        <div className="communityInputContainer"><input name="community" className="communityInput" onChange={(e) => props.setTextField(e.target.value)}></input></div>
    </div>
}

const TitleEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Title</span>
        <div className="titleInputContainer"><input name="title" className="titleInput" onChange={(e) => props.setTextField(e.target.value)}></input></div>
    </div>
}

const LinkEditor = (props: IThreadTextField) =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Link</span> <span className="inputTitleOptional">(optional)</span>
        <div className="titleInputContainer"><input name="link" className="titleInput" onChange={(e) => props.setTextField(e.target.value)}></input></div>
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

async function tryCreateThread(title: String | null, community: String | null, link: String | null, bodyHTML: String | null, setErrorMessage: Dispatch<SetStateAction<string | null>>, token: string | null)
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