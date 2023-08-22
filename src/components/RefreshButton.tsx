import { HiRefresh } from "react-icons/hi";
interface props {
  onRefresh: () => void;
}
const RefreshButton = ({ onRefresh }: props) => {
  return (
    <button onClick={() => onRefresh}>
      <HiRefresh className="w-15 h-15 text-3xl text-gruv-gray hover:text-gruv-light-gray" />
    </button>
  );
};

export default RefreshButton;
