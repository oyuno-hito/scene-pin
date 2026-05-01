# BookmarkControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**_delete**](BookmarkControllerApi.md#_delete) | **DELETE** /api/videos/{videoId}/bookmarks/{id} |  |
| [**create**](BookmarkControllerApi.md#create) | **POST** /api/videos/{videoId}/bookmarks |  |
| [**listByVideo1**](BookmarkControllerApi.md#listbyvideo1) | **GET** /api/videos/{videoId}/bookmarks |  |
| [**update**](BookmarkControllerApi.md#update) | **PATCH** /api/videos/{videoId}/bookmarks/{id} |  |



## _delete

> _delete(videoId, id)



### Example

```ts
import {
  Configuration,
  BookmarkControllerApi,
} from '';
import type { DeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BookmarkControllerApi();

  const body = {
    // number
    videoId: 789,
    // number
    id: 789,
  } satisfies DeleteRequest;

  try {
    const data = await api._delete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## create

> BookmarkResponse create(videoId, bookmarkCreateRequest)



### Example

```ts
import {
  Configuration,
  BookmarkControllerApi,
} from '';
import type { CreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BookmarkControllerApi();

  const body = {
    // number
    videoId: 789,
    // BookmarkCreateRequest
    bookmarkCreateRequest: ...,
  } satisfies CreateRequest;

  try {
    const data = await api.create(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |
| **bookmarkCreateRequest** | [BookmarkCreateRequest](BookmarkCreateRequest.md) |  | |

### Return type

[**BookmarkResponse**](BookmarkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listByVideo1

> Array&lt;BookmarkResponse&gt; listByVideo1(videoId)



### Example

```ts
import {
  Configuration,
  BookmarkControllerApi,
} from '';
import type { ListByVideo1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BookmarkControllerApi();

  const body = {
    // number
    videoId: 789,
  } satisfies ListByVideo1Request;

  try {
    const data = await api.listByVideo1(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;BookmarkResponse&gt;**](BookmarkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## update

> BookmarkResponse update(videoId, id, bookmarkUpdateRequest)



### Example

```ts
import {
  Configuration,
  BookmarkControllerApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BookmarkControllerApi();

  const body = {
    // number
    videoId: 789,
    // number
    id: 789,
    // BookmarkUpdateRequest
    bookmarkUpdateRequest: ...,
  } satisfies UpdateRequest;

  try {
    const data = await api.update(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **videoId** | `number` |  | [Defaults to `undefined`] |
| **id** | `number` |  | [Defaults to `undefined`] |
| **bookmarkUpdateRequest** | [BookmarkUpdateRequest](BookmarkUpdateRequest.md) |  | |

### Return type

[**BookmarkResponse**](BookmarkResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

