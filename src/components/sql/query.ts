import { query } from '@/utils/http'

export const queryAllTables = () => {
  const sql = `SELECT t.database,
        t.name,
        t.engine,
        -- t.*,
        pa.size
    FROM system.tables as t ANY LEFT JOIN ( SELECT database,table as name,formatReadableSize(sum(bytes)) as size FROM system.parts  GROUP BY database,name ) as pa USING (database,name)
    LIMIT 10000

    FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryAllDatabases = () => {
  const sql = `SELECT name FROM system.databases LIMIT 10000

  FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryAllColumns = () => {
  const sql = `SELECT * FROM system.columns

    LIMIT 50000

  FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryTableDataPaneData = (table: any, rows = 100) => {
  const sql = `select * from ${table.database}.${table.name} limit ${rows}
  FORMAT JSON;`
  return query(sql).then(res => {
    return res
  })
}

export const queryPropertiesColumns = (table: any) => {
  const sql = `DESCRIBE TABLE ${table.database}.${table.name} FORMAT JSON`
  return query(sql).then(res => {
    return res
  })
}

export const queryPropertiesStatistics = (table: any) => {
  const sql = `SELECT table,
    sum(rows) AS rows,
    formatReadableSize(sum(bytes)) as size,
    min(min_date) as min_date,
    max(max_date) as max_date
    FROM system.parts
    WHERE active
    and database = '${table.database}' and table = '${table.name}'
    GROUP BY table FORMAT JSON
  `
  return query(sql).then(res => {
    const data = res.data[0]
    return {
      columns: [
        {
          name: 'Name'
        },
        {
          name: 'Value'
        },
      ],
      tableData: data && res.meta.map((item: any) => {
        return {
          Name: item.name,
          Value: data[item.name]
        }
      })
    }
  })
}

export function getEntityLineage (params: any) {
  return fetch(`${import.meta.env.VITE_BASE_DATAHUB_URL}/api/v2/graphql`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      'operationName': 'getEntityLineage',
      'variables': params,
      'query': `query getEntityLineage($urn: String!) {
    entity(urn: $urn) {
      urn
      type
      ...lineageNodeProperties
      ... on EntityWithRelationships {
        upstream: lineage(input: {direction: UPSTREAM, start: 0, count: 100}) {
          ...fullLineageResults
          __typename
        }
        downstream: lineage(input: {direction: DOWNSTREAM, start: 0, count: 100}) {
          ...fullLineageResults
          __typename
        }
        __typename
      }
      __typename
    }
  }

  fragment lineageNodeProperties on EntityWithRelationships {
    urn
    type
    ... on DataJob {
      ...dataJobFields
      editableProperties {
        description
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on DataFlow {
      orchestrator
      flowId
      cluster
      properties {
        name
        description
        project
        __typename
      }
      ownership {
        ...ownershipFields
        __typename
      }
      globalTags {
        ...globalTagsFields
        __typename
      }
      glossaryTerms {
        ...glossaryTerms
        __typename
      }
      editableProperties {
        description
        __typename
      }
      platform {
        ...platformFields
        __typename
      }
      domain {
        ...entityDomain
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on Dashboard {
      ...dashboardFields
      editableProperties {
        description
        __typename
      }
      platform {
        ...platformFields
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on Chart {
      tool
      chartId
      properties {
        name
        description
        __typename
      }
      editableProperties {
        description
        __typename
      }
      ownership {
        ...ownershipFields
        __typename
      }
      platform {
        ...platformFields
        __typename
      }
      domain {
        ...entityDomain
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on Dataset {
      name
      properties {
        name
        description
        __typename
      }
      editableProperties {
        description
        __typename
      }
      platform {
        ...platformFields
        __typename
      }
      ownership {
        ...ownershipFields
        __typename
      }
      subTypes {
        typeNames
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on MLModelGroup {
      urn
      type
      name
      description
      origin
      platform {
        ...platformFields
        __typename
      }
      ownership {
        ...ownershipFields
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on MLModel {
      urn
      type
      name
      description
      origin
      platform {
        ...platformFields
        __typename
      }
      ownership {
        ...ownershipFields
        __typename
      }
      status {
        removed
        __typename
      }
      __typename
    }
    ... on MLFeatureTable {
      ...nonRecursiveMLFeatureTable
      __typename
    }
    ... on MLFeature {
      ...nonRecursiveMLFeature
      __typename
    }
    ... on MLPrimaryKey {
      ...nonRecursiveMLPrimaryKey
      __typename
    }
    __typename
  }

  fragment dataJobFields on DataJob {
    urn
    type
    dataFlow {
      ...nonRecursiveDataFlowFields
      __typename
    }
    jobId
    ownership {
      ...ownershipFields
      __typename
    }
    inputOutput {
      inputDatasets {
        ...nonRecursiveDatasetFields
        __typename
      }
      outputDatasets {
        ...nonRecursiveDatasetFields
        __typename
      }
      inputDatajobs {
        ...nonRecursiveDataJobFields
        __typename
      }
      __typename
    }
    properties {
      name
      description
      externalUrl
      customProperties {
        key
        value
        __typename
      }
      __typename
    }
    editableProperties {
      description
      __typename
    }
    globalTags {
      ...globalTagsFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    __typename
  }

  fragment nonRecursiveDataFlowFields on DataFlow {
    urn
    type
    orchestrator
    flowId
    cluster
    properties {
      name
      description
      project
      externalUrl
      customProperties {
        key
        value
        __typename
      }
      __typename
    }
    editableProperties {
      description
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    platform {
      ...platformFields
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    __typename
  }

  fragment ownershipFields on Ownership {
    owners {
      owner {
        ... on CorpUser {
          urn
          type
          username
          info {
            active
            displayName
            title
            email
            firstName
            lastName
            fullName
            __typename
          }
          properties {
            active
            displayName
            title
            email
            firstName
            lastName
            fullName
            __typename
          }
          editableProperties {
            displayName
            title
            pictureLink
            email
            __typename
          }
          __typename
        }
        ... on CorpGroup {
          urn
          type
          name
          properties {
            displayName
            email
            __typename
          }
          info {
            displayName
            email
            admins {
              urn
              username
              info {
                active
                displayName
                title
                email
                firstName
                lastName
                fullName
                __typename
              }
              editableInfo {
                pictureLink
                teams
                skills
                __typename
              }
              __typename
            }
            members {
              urn
              username
              info {
                active
                displayName
                title
                email
                firstName
                lastName
                fullName
                __typename
              }
              editableInfo {
                pictureLink
                teams
                skills
                __typename
              }
              __typename
            }
            groups
            __typename
          }
          __typename
        }
        __typename
      }
      type
      __typename
    }
    lastModified {
      time
      __typename
    }
    __typename
  }

  fragment platformFields on DataPlatform {
    urn
    type
    name
    properties {
      type
      displayName
      datasetNameDelimiter
      logoUrl
      __typename
    }
    displayName
    info {
      type
      displayName
      datasetNameDelimiter
      logoUrl
      __typename
    }
    __typename
  }

  fragment entityDomain on Domain {
    urn
    properties {
      name
      __typename
    }
    __typename
  }

  fragment deprecationFields on Deprecation {
    actor
    deprecated
    note
    decommissionTime
    __typename
  }

  fragment nonRecursiveDatasetFields on Dataset {
    urn
    name
    type
    origin
    uri
    platform {
      ...platformFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    platformNativeType
    properties {
      name
      description
      customProperties {
        key
        value
        __typename
      }
      externalUrl
      __typename
    }
    editableProperties {
      description
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    schemaMetadata(version: 0) {
      ...schemaMetadataFields
      __typename
    }
    previousSchemaMetadata: schemaMetadata(version: -1) {
      ...schemaMetadataFields
      __typename
    }
    editableSchemaMetadata {
      editableSchemaFieldInfo {
        fieldPath
        description
        globalTags {
          ...globalTagsFields
          __typename
        }
        __typename
      }
      __typename
    }
    globalTags {
      ...globalTagsFields
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    subTypes {
      typeNames
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    container {
      ...entityContainer
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    __typename
  }

  fragment dataPlatformInstanceFields on DataPlatformInstance {
    urn
    type
    platform {
      ...platformFields
      __typename
    }
    instanceId
    __typename
  }

  fragment institutionalMemoryFields on InstitutionalMemory {
    elements {
      url
      author {
        urn
        username
        __typename
      }
      description
      created {
        actor
        time
        __typename
      }
      __typename
    }
    __typename
  }

  fragment schemaMetadataFields on SchemaMetadata {
    aspectVersion
    createdAt
    datasetUrn
    name
    platformUrn
    version
    cluster
    hash
    platformSchema {
      ... on TableSchema {
        schema
        __typename
      }
      ... on KeyValueSchema {
        keySchema
        valueSchema
        __typename
      }
      __typename
    }
    fields {
      fieldPath
      jsonPath
      nullable
      description
      type
      nativeDataType
      recursive
      isPartOfKey
      globalTags {
        ...globalTagsFields
        __typename
      }
      glossaryTerms {
        ...glossaryTerms
        __typename
      }
      __typename
    }
    primaryKeys
    foreignKeys {
      name
      sourceFields {
        fieldPath
        __typename
      }
      foreignFields {
        fieldPath
        __typename
      }
      foreignDataset {
        urn
        name
        type
        origin
        uri
        properties {
          description
          __typename
        }
        platform {
          ...platformFields
          __typename
        }
        platformNativeType
        ownership {
          ...ownershipFields
          __typename
        }
        globalTags {
          ...globalTagsFields
          __typename
        }
        glossaryTerms {
          ...glossaryTerms
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment globalTagsFields on GlobalTags {
    tags {
      tag {
        urn
        name
        description
        properties {
          colorHex
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment glossaryTerms on GlossaryTerms {
    terms {
      term {
        ...glossaryTerm
        __typename
      }
      __typename
    }
    __typename
  }

  fragment glossaryTerm on GlossaryTerm {
    urn
    name
    type
    hierarchicalName
    properties {
      name
      definition
      termSource
      __typename
    }
    __typename
  }

  fragment entityContainer on Container {
    urn
    platform {
      ...platformFields
      __typename
    }
    properties {
      name
      __typename
    }
    subTypes {
      typeNames
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    __typename
  }

  fragment nonRecursiveDataJobFields on DataJob {
    urn
    properties {
      name
      description
      externalUrl
      customProperties {
        key
        value
        __typename
      }
      __typename
    }
    globalTags {
      ...globalTagsFields
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    __typename
  }

  fragment dashboardFields on Dashboard {
    urn
    type
    tool
    dashboardId
    properties {
      name
      description
      customProperties {
        key
        value
        __typename
      }
      externalUrl
      access
      lastRefreshed
      created {
        time
        __typename
      }
      lastModified {
        time
        __typename
      }
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    globalTags {
      ...globalTagsFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    platform {
      ...platformFields
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    container {
      ...entityContainer
      __typename
    }
    parentContainers {
      ...parentContainersFields
      __typename
    }
    status {
      removed
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    __typename
  }

  fragment parentContainersFields on ParentContainersResult {
    count
    containers {
      ...entityContainer
      __typename
    }
    __typename
  }

  fragment nonRecursiveMLFeatureTable on MLFeatureTable {
    urn
    type
    name
    platform {
      ...platformFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    description
    properties {
      description
      mlFeatures {
        ...nonRecursiveMLFeature
        __typename
      }
      mlPrimaryKeys {
        ...nonRecursiveMLPrimaryKey
        __typename
      }
      customProperties {
        key
        value
        __typename
      }
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    status {
      removed
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    tags {
      ...globalTagsFields
      __typename
    }
    editableProperties {
      description
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    __typename
  }

  fragment nonRecursiveMLFeature on MLFeature {
    urn
    type
    name
    featureNamespace
    description
    dataType
    properties {
      description
      dataType
      version {
        versionTag
        __typename
      }
      sources {
        urn
        name
        type
        origin
        description
        uri
        platform {
          ...platformFields
          __typename
        }
        platformNativeType
        __typename
      }
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    status {
      removed
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    tags {
      ...globalTagsFields
      __typename
    }
    editableProperties {
      description
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    featureTables: relationships(
      input: {types: ["Contains"], direction: INCOMING, start: 0, count: 100}
    ) {
      relationships {
        type
        entity {
          ... on MLFeatureTable {
            platform {
              ...platformFields
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment nonRecursiveMLPrimaryKey on MLPrimaryKey {
    urn
    type
    name
    featureNamespace
    description
    dataType
    properties {
      description
      dataType
      version {
        versionTag
        __typename
      }
      sources {
        urn
        name
        type
        origin
        description
        uri
        platform {
          ...platformFields
          __typename
        }
        platformNativeType
        __typename
      }
      __typename
    }
    ownership {
      ...ownershipFields
      __typename
    }
    institutionalMemory {
      ...institutionalMemoryFields
      __typename
    }
    status {
      removed
      __typename
    }
    glossaryTerms {
      ...glossaryTerms
      __typename
    }
    domain {
      ...entityDomain
      __typename
    }
    tags {
      ...globalTagsFields
      __typename
    }
    editableProperties {
      description
      __typename
    }
    deprecation {
      ...deprecationFields
      __typename
    }
    dataPlatformInstance {
      ...dataPlatformInstanceFields
      __typename
    }
    featureTables: relationships(
      input: {types: ["KeyedBy"], direction: INCOMING, start: 0, count: 100}
    ) {
      relationships {
        type
        entity {
          ... on MLFeatureTable {
            platform {
              ...platformFields
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment fullLineageResults on EntityLineageResult {
    start
    count
    total
    relationships {
      type
      entity {
        ...relationshipFields
        __typename
      }
      __typename
    }
    __typename
  }

  fragment relationshipFields on EntityWithRelationships {
    ...lineageNodeProperties
    upstream: lineage(input: {direction: UPSTREAM, start: 0, count: 100}) {
      ...leafLineageResults
      __typename
    }
    downstream: lineage(input: {direction: DOWNSTREAM, start: 0, count: 100}) {
      ...leafLineageResults
      __typename
    }
    __typename
  }

  fragment leafLineageResults on EntityLineageResult {
    start
    count
    total
    relationships {
      type
      entity {
        urn
        type
        __typename
      }
      __typename
    }
    __typename
  }
  `
    })
  })
}