import React from 'react'
import './App.css'
import OrgChart from '@unicef/react-org-chart'
import { BrowserRouter, Route } from 'react-router-dom'
import { organizationTree } from './tree'
import avatarPersonnel from './assets/avatar-personnel.svg'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tree: organizationTree,
      downloadingChart: false,
      config: {},
      highlightPostNumbers: [1],
    }
  }

  getChild = name => {
    const queue = [organizationTree]
    while (queue.length > 0) {
      const node = queue.shift()
      if (node.person.name === name) {
        return node
      }
      queue.push(...node.children)
    }
    return null
  }

  getParent = node => {
    if (node === organizationTree) {
      return null
    }

    const queue = [organizationTree]
    while (queue.length > 0) {
      const currentNode = queue.shift()
      if (currentNode.children.includes(node)) {
        return currentNode
      }
      queue.push(...currentNode.children)
    }
    return null
  }

  handleDownload = () => {
    this.setState({ downloadingChart: false })
  }

  handleOnChangeConfig = config => {
    this.setState({ config: config })
  }

  handleLoadConfig = () => {
    const { config } = this.state
    return config
  }

  render() {
    const { tree, downloadingChart } = this.state

    //For downloading org chart as image or pdf based on id
    const downloadImageId = 'download-image'
    const downloadPdfId = 'download-pdf'

    return (
      <BrowserRouter basename="/react-org-chart">
        <Route exact path="/">
          <React.Fragment>
            {/* ... */}
            <OrgChart
              tree={tree}
              downloadImageId={downloadImageId}
              downloadPdfId={downloadPdfId}
              onConfigChange={config => {
                this.handleOnChangeConfig(config)
              }}
              loadConfig={d => {
                let configuration = this.handleLoadConfig(d)
                if (configuration) {
                  return configuration
                }
              }}
              downlowdedOrgChart={d => {
                this.handleDownload()
              }}
              loadImage={d => {
                return Promise.resolve(avatarPersonnel)
              }}
              loadParent={d => {
                const parentData = this.getParent(d)
                return parentData
              }}
              loadChildren={d => {
                const childrenData = this.getChild(d.person.name)
                return childrenData
              }}
            />
          </React.Fragment>
        </Route>
      </BrowserRouter>
    )
  }
}
