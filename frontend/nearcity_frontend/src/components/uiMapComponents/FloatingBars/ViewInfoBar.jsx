import FloatingBar from "../uiModels/FloatingBar";
/*
viewInfo:{
    title: string,
}
*/
const ViewInfoBar = ({ viewInfo }) => {
  return (
    <>
      <FloatingBar width="30%">

        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-white">{viewInfo}</h1>
        </div>
      </FloatingBar>
    </>
  );
};

export default ViewInfoBar;
