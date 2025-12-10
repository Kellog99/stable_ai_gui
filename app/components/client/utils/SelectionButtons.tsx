
import { ButtonProps } from '@/interfaces/NNInterfaces';
import './utils.css';



const SelectionButton: React.FC<ButtonProps> = ({
    id,
    name,
    Icon,
    currentPage,
    onClickHandle
}) => {
    // This component allows to construct all the same buttons with the same actions.
    const getStyle = () => {
        if (currentPage === id) {
            return `button active`;
        } else {
            return `button inactive`;
        }
    }
    return (
        <button
            onClick={onClickHandle}
            className={getStyle()}
        >
            <Icon />
            <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
        </button >
    )
}
export default SelectionButton;