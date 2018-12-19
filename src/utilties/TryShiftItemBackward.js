const TryShiftItemBackward = (itemIndex, array) => {
    if (array.length <= 1 || itemIndex === array.length - 1) {
        // Cant Shift.
        return array;
    }

    let itemA = array[itemIndex];
    let itemB = array[itemIndex + 1];

    array[itemIndex] = itemB;
    array[itemIndex + 1] = itemA;

    return array;
}

export default TryShiftItemBackward;