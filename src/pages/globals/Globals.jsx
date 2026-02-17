import UpdateGlobalGSTCard from "../../components/globals/UpdateGlobalGSTCard";
import Wrapper from "../../components/wrappers/Wrapper";

const Globals = () => {
  return (
    <Wrapper>
      <div>
        <h1 className="font-inter text-2xl font-bold text-[#353535]">
          Globals
        </h1>
        <p>Set Global settings for the abhicares platform</p>

        <div className="grid grid-cols-2 gap-5 mt-5">
          <UpdateGlobalGSTCard />
        </div>
      </div>
    </Wrapper>
  );
};

export default Globals;
