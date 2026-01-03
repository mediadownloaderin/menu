import Logo from "../ui/logo";
import { SidebarTrigger } from "../ui/sidebar";


export function AdminBoardHeader() {

    return (
        <header className=" fixed sm:left-64 left-0 right-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white  px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger className=" lg:hidden" />
                <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-white/20">
                    <Logo />
                </div>
            </div>


        </header>
    );
}