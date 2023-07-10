import { useContext, useState } from "react";
import "./VotingBoxStyles.scss";
import axios from "axios";
import { AuthContext } from "../../communities/Home";

const thumbsUpPath = require("../../../icons/thumbs-up.svg").default as string;
const thumbsDownPath = require("../../../icons/thumbs-down.svg").default as string;
const thumbsUpFilledPath = require("../../../icons/thumbs-up-filled.svg").default as string;
const thumbsDownFilledPath = require("../../../icons/thumbs-down-filled.svg").default as string;

export enum VoteState
{
    Liked = 1,
    Disliked = -1,
    None = 0,
}

interface IVotingBox 
{
    id: string,
    submitLike: Function,
    submitDislike: Function,
    voteState?: VoteState,
}

export class CommentVotingBox implements IVotingBox
{
    authContext = useContext(AuthContext);
    voteState: VoteState;
    id: string;

    constructor(id: string, voteState: VoteState){
        this.id = id;
        this.voteState = voteState;
    }

    submitLike()
    {
        if (this.voteState === VoteState.Liked) {
            axios.post(`http://localhost:5000/api/comment/${this.id}/vote/removeVote`, [this.authContext.token]);
        }

        else {
            axios.post(`http://localhost:5000/api/comment/${this.id}/vote/like`, [this.authContext.token]);
        }
    }

    submitDislike() 
    {
        if (this.voteState === VoteState.Disliked) {
            axios.post(`http://localhost:5000/api/comment/${this.id}/vote/removeVote`, [this.authContext.token]);
        }
        
        else {
            axios.post(`http://localhost:5000/api/comment/${this.id}/vote/dislike`, [this.authContext.token]);
        }
    }

}

export class ThreadVotingBox implements IVotingBox
{
    authContext = useContext(AuthContext);
    id: string;
    voteState: VoteState;

    constructor(id: string, voteState: VoteState){
        this.id = id;
        this.voteState = voteState;
    }

    submitLike()
    {
        if (this.voteState === VoteState.Liked) {
            axios.post(`http://localhost:5000/api/thread/${this.id}/vote/removeVote`, [this.authContext.token]);
        }

        else {
            axios.post(`http://localhost:5000/api/thread/${this.id}/vote/like`, [this.authContext.token]);
        }
    }

    submitDislike() 
    {
        if (this.voteState === VoteState.Disliked) {
            axios.post(`http://localhost:5000/api/thread/${this.id}/vote/removeVote`, [this.authContext.token]);
        }
        
        else {
            axios.post(`http://localhost:5000/api/thread/${this.id}/vote/dislike`, [this.authContext.token]);
        }
    }
}

interface IVotingBoxProps
{
    votingBox: IVotingBox;
}

export const VotingBox = (props: IVotingBoxProps) =>
{
    const [voteState, setVoteState] = useState<VoteState>(props.votingBox.voteState || VoteState.None);

    const getNewVoteType = (voteType: VoteState.Liked | VoteState.Disliked, currentVoteState: VoteState) =>
    {
        if (currentVoteState === voteType)
        {
            return VoteState.None;
        }

        else
        {
            return voteType;
        }
    }

    return <div className="voteBox">
        <div className="threadLike" >
            <button onClick={() => {
                setVoteState(getNewVoteType(VoteState.Liked, voteState));
                props.votingBox.submitLike();
                }
            } className="buttonVote">
                <img alt="Like" width="24px" height="24px" src={(voteState === VoteState.Liked) ? thumbsUpFilledPath : thumbsUpPath}></img>
            </button>
        </div>
        <div className="threadDisike">
            <button onClick={() => {
                setVoteState(getNewVoteType(VoteState.Disliked, voteState))
                props.votingBox.submitDislike();
                }
            } className="buttonVote">
                <img alt="Dislike" width="24px" height="24px" src={(voteState === VoteState.Disliked) ? thumbsDownFilledPath : thumbsDownPath}></img>
            </button>
        </div>  
    </div>
}

