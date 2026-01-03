import { config } from "@/lib/config";

const Logo = () => {
  return (
    <div className="flex items-center text-center justify-center px-4 py-2 bg-red-100 rounded-4xl max-w-40">
     
      <span className=" text-sm font-extrabold tracking-tight text-black">
        <span className="text-red-600">{config.name}</span></span>
    </div>
  );
};

export default Logo;