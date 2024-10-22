import MapFloatingButton from "../MapFloatingButton";


const ButtonGroup = ({buttonsInfo}) => {
  return (
    <div className="absolute bottom-4 left-1/2 gap-2 flex flex-row  z-[999]">
      {buttonsInfo.map((buttonInfo, index) => (
        <MapFloatingButton key={index} onClick={buttonInfo.onClick} icon={buttonInfo.icon} id={buttonInfo.id} />
      ))}

    </div>
  );
};

export default ButtonGroup;


// props validation

import PropTypes from 'prop-types';

ButtonGroup.propTypes = {
  buttonsInfo: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    onClick: PropTypes.func
  }))
}
