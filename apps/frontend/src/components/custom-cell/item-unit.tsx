import { Stack } from 'react-bootstrap';

import { BathroomIcon, BedIcon } from 'core-ui/icons';

interface IItemUnitProps {
  id: number;
  unit_type: {
    bed_rooms: number;
    bath_rooms: number;
  };
  is_occupied: boolean;
}

const ItemUnit = ({ value }: { value?: IItemUnitProps }) => {
  if (!value) return <span>-</span>;

  return (
    <div className="d-flex me-5">
      <div className="cell-font-size">
        <p className="fw-bold mb-1">ID-{value.id}</p>
        <Stack direction="horizontal" className="align-items-center">
          <p className="text-primary fw-medium m-0">
            <BedIcon /> {value.unit_type.bed_rooms}
          </p>
          <div className="border-end border-2 mx-3" style={{ height: 30 }} />
          <p className="text-primary fw-medium m-0">
            <BathroomIcon /> {value.unit_type.bath_rooms}
          </p>
        </Stack>
      </div>
    </div>
  );
};

export default ItemUnit;
