const TryShiftItemForward = (itemIndex, array) => {
    if (array.length <= 1 || itemIndex === 0) {
        // Cant Shift.
        return array;
    }

    let itemA = array[itemIndex];
    let itemB = array[itemIndex - 1];

    array[itemIndex] = itemB;
    array[itemIndex - 1] = itemA;

    return array;

}

export default TryShiftItemForward;