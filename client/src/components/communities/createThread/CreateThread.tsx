import Quill from "quill";
import "./CreateThread.css";
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useId, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Home";

export const CreateThread = () =>
{
    const authContext = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    return <form method="post" onSubmit={(e) => tryCreateThread(e, setErrorMessage, authContext.token)} className="createThreadForm">
        <div className="createThreadFormTitle">Create a Thread</div>
        <ErrorMessage error={errorMessage} />
        <CommunityEditor />
        <TitleEditor />
        <LinkEditor />
        <BodyEditor />
        <button className="createThreadButton" type="submit">Create Thread</button>
    </form>

}

const CommunityEditor = () =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Community</span> 
        <div className="communityInputContainer"><input name="community" className="communityInput" type="text"></input></div>
    </div>
}

const TitleEditor = () =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Title</span>
        <div className="titleInputContainer"><input name="title" className="titleInput" type="text"></input></div>
    </div>
}

const LinkEditor = () =>
{
    return <div className="titleEditorContainer">
        <span className="titleInputTitle">Link</span> <span className="inputTitleOptional">(optional)</span>
        <div className="titleInputContainer"><input name="link" className="titleInput" type="text"></input></div>
    </div>
}

const BodyEditor = () =>
{
    const hiddenBodyForm = useId();

    useEffect(() =>
    {
        const quill = new Quill('#editor', {theme: 'bubble'});
        quill.on('text-change', () =>
        {
            const hiddenBodyElement = document.getElementById(hiddenBodyForm) as HTMLInputElement;
            hiddenBodyElement.value = JSON.stringify(quill.getContents());
        });
    });
    return <div className="bodyEditorContainer">
        <link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet"></link>
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <span className="bodyInputTitle">Body</span> <span className="inputTitleOptional">(optional)</span>
        <div id="editor"></div>
        <input name="body" type="hidden" id={hiddenBodyForm}></input>
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

async function tryCreateThread(e: FormEvent<HTMLFormElement>, setErrorMessage: Dispatch<SetStateAction<string | null>>, token: string | null)
{
    e.preventDefault();

    const form = e.target as any;
    const formData = new FormData(form) as any;
    const community = formData.get("community");
    const title = formData.get("title");
    const link = formData.get("link");
    const body = formData.get("body");
    
    if (formData.get("title") == null) 
    {
        console.log(formData);
        setErrorMessage("A title is required.");
        return;
    }

    if (formData.get("community") == null)
    {
        console.log(formData);
        setErrorMessage("A community is required.")
        return;
    }

    try {
        await axios.post('http://localhost:5000/api/createthread', {community, title, link, body, token});
    } catch (err: any) {
        console.log(err);
    }
}