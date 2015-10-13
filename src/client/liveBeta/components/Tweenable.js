/* Decorator to add react-tween-state to class */
import TweenState from 'react-tween-state';

export default SubComponent => {
    Object.assign(SubComponent.prototype, TweenState.Mixin);
    console.log('SubComponent,', SubComponent);
    return SubComponent;
};
