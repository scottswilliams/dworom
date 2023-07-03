import { useState } from "react";
import "./VotingBoxStyles.scss";

const thumbsUpPath = require("../../../icons/thumbs-up.svg").default as string;
const thumbsDownPath = require("../../../icons/thumbs-down.svg").default as string;
const thumbsUpFilledPath = require("../../../icons/thumbs-up-filled.svg").default as string;
const thumbsDownFilledPath = require("../../../icons/thumbs-down-filled.svg").default as string;


export enum VoteState
{
    Liked,
    Disliked,
    None,
}

export interface IVotingBoxProps 
{
    voteState?: VoteState,
}

export const VotingBox = (props: IVotingBoxProps) =>
{
    const [voteState, setVoteState] = useState<VoteState>(props.voteState || VoteState.None);

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
            <button onClick={() => setVoteState(getNewVoteType(VoteState.Liked, voteState))} className="button buttonVote">
                <img alt="Like" width="24px" height="24px" src={(voteState === VoteState.Liked) ? thumbsUpFilledPath : thumbsUpPath}></img>
            </button>
        </div>
        <div className="threadDisike">
            <button onClick={() => setVoteState(getNewVoteType(VoteState.Disliked, voteState))} className="button buttonVote">
                <img alt="Dislike" width="24px" height="24px" src={(voteState === VoteState.Disliked) ? thumbsDownFilledPath : thumbsDownPath}></img>
            </button>
        </div>  
    </div>
}

