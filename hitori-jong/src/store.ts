import { Action } from './constant';

const useStore = () => {
  const dispatch = (action: Action) => {
    switch (action.type) {
    }
  };

  return {
    dispatch,
  };
};

export default useStore;
