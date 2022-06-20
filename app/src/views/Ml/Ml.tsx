import React, { useState } from 'react'

import List from './components/List/List'
import Add from './components/Add/Add'

import css from './Ml.css'
import Result from './components/Result/Result'
import { RouteComponentProps, withRouter } from 'react-router';
import { typedInject } from 'module/mobx-utils'
import { AppStore, Stores } from 'stores'

interface InjectedProps {
  store: AppStore;
}
type Props = InjectedProps;

type RoutedProps = Props & RouteComponentProps<any>;

const Ml = () => {
  const [finalValue, setFinalValue] = useState<{ [key: string]: any }>({})
  const [isWhich, setIsWhich] = useState<number>(1)

  return <section className={css.Ml}>
    {
      isWhich === 1 && <List setIsWhich={setIsWhich} setFinalValue={setFinalValue} />
    }
    {
      isWhich === 2 && <Add setFinalValue={setFinalValue} onEnd={(data) => {
        setFinalValue(data)
        setIsWhich(3)
      }} />
    }
    {
      isWhich === 3 && <Result finalValue={finalValue} setIsWhich={setIsWhich} />
    }
  </section>
}

export default withRouter(typedInject<InjectedProps, RoutedProps, Stores>(({ store }) => ({
  store: store.appStore,
}))(Ml))