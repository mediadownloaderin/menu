"use client"
import { useSearchParams } from "next/navigation";
import AddUpdateMenu from "../add-update-menu";

export default function AddMenu(){
    const slug = useSearchParams().get("slug");
    return (
        <div>
            <AddUpdateMenu slug={slug??""}/>
        </div>
    )
}