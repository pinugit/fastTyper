import { HiRefresh } from "react-icons/hi";
interface props {
  onRefresh: () => void;
}
const RefreshButton = ({ onRefresh }: props) => {
  return (
    <button onClick={() => onRefresh()} className="h">
      <HiRefresh className="w-16 h-16 p-5 text-3xl text-gruv-gray hover:text-gruv-light-gray" />
    </button>
  );
};

export default RefreshButton;
