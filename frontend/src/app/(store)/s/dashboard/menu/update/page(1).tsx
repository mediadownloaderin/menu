"use client"
import { useSearchParams } from "next/navigation";
import AddUpdateMenu from "../add-update-menu";

export default function UpdateMenu() {
    const slug = useSearchParams().get("slug");
    const id = useSearchParams().get("id");
    return (
    <div>
        <AddUpdateMenu slug={slug ?? ""} id={Number(id) ?? -1} />
    </div>)
}
